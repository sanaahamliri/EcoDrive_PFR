const Ride = require('../models/Ride');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

// @desc    Créer un nouveau trajet
exports.createRide = asyncHandler(async (req, res) => {
  req.body.driver = req.user.id;
  const ride = await Ride.create(req.body);
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { 'stats.totalTrips': 1 }
  });

  res.status(201).json({
    success: true,
    data: ride
  });
});

// @desc    Obtenir tous les trajets avec filtres
exports.getRides = asyncHandler(async (req, res) => {
  let query = {};

  if (req.query.from) query['departure.city'] = new RegExp(req.query.from, 'i');
  if (req.query.to) query['destination.city'] = new RegExp(req.query.to, 'i');
  if (req.query.date) {
    const date = new Date(req.query.date);
    query.departureTime = {
      $gte: new Date(date.setHours(0, 0, 0)),
      $lte: new Date(date.setHours(23, 59, 59))
    };
  }

  if (req.query.maxPrice) query.price = { $lte: parseFloat(req.query.maxPrice) };
  if (req.query.seats) query.availableSeats = { $gte: parseInt(req.query.seats) };
  if (req.query.preferences) {
    const prefs = req.query.preferences.split(',');
    prefs.forEach(pref => {
      query[`preferences.${pref}`] = true;
    });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Ride.countDocuments(query);

  const rides = await Ride.find(query)
    .populate('driver', 'firstName lastName avatar stats.rating')
    .skip(startIndex)
    .limit(limit)
    .sort({ departureTime: 'asc' });

  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: rides.length,
    pagination,
    data: rides
  });
});

// @desc    Obtenir un trajet spécifique
exports.getRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id)
    .populate('driver', 'firstName lastName avatar stats.rating phoneNumber')
    .populate('passengers.user', 'firstName lastName avatar');

  if (!ride) {
    return next(new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: ride
  });
});

// @desc    Mettre à jour un trajet
exports.updateRide = asyncHandler(async (req, res, next) => {
  let ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404));
  }

  if (ride.driver.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Non autorisé à modifier ce trajet`, 401));
  }

  if (ride.passengers.length > 0 && (req.body.availableSeats || req.body.departureTime)) {
    return next(new ErrorResponse(`Impossible de modifier les places ou l'heure de départ avec des réservations existantes`, 400));
  }

  ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: ride
  });
});

// @desc    Supprimer un trajet
exports.deleteRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404));
  }

  if (!req.user) {
    return next(new ErrorResponse('Non autorisé - Authentification requise', 401));
  }

  if (ride.driver.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Non autorisé à supprimer ce trajet`, 401));
  }

  if (ride.passengers.length > 0) {
    return next(new ErrorResponse(`Impossible de supprimer un trajet avec des réservations existantes`, 400));
  }

  await Ride.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Réserver un trajet
exports.bookRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404));
  }

  if (ride.driver.toString() === req.user.id) {
    return next(new ErrorResponse(`Vous ne pouvez pas réserver votre propre trajet`, 400));
  }

  if (ride.passengers.some(p => p.user.toString() === req.user.id)) {
    return next(new ErrorResponse(`Vous avez déjà réservé ce trajet`, 400));
  }

  const seatsRequested = req.body.seats || 1;
  if (ride.remainingSeats < seatsRequested) {
    return next(new ErrorResponse(`Il n'y a pas assez de places disponibles`, 400));
  }

  ride.passengers.push({
    user: req.user.id,
    bookedSeats: seatsRequested
  });

  await ride.save();

  res.status(200).json({
    success: true,
    data: ride
  });
});

// @desc    Annuler une réservation
exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404));
  }

  const bookingIndex = ride.passengers.findIndex(
    p => p.user.toString() === req.user.id
  );

  if (bookingIndex === -1) {
    return next(new ErrorResponse(`Réservation non trouvée`, 404));
  }

  const cancelDeadline = new Date(ride.departureTime);
  cancelDeadline.setHours(cancelDeadline.getHours() - 24);
  
  if (Date.now() > cancelDeadline) {
    return next(new ErrorResponse(`Impossible d'annuler moins de 24h avant le départ`, 400));
  }

  ride.passengers.splice(bookingIndex, 1);
  await ride.save();

  res.status(200).json({
    success: true,
    data: ride
  });
});
