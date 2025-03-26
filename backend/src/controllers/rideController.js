const Ride = require("../models/Ride");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Review = require("../models/Review");

exports.createRide = asyncHandler(async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({
      success: false,
      message: "Seuls les conducteurs peuvent créer des trajets",
    });
  }

  const user = await User.findById(req.user.id);
  if (!user.isDriverProfileComplete()) {
    return res.status(400).json({
      success: false,
      message:
        "Votre profil conducteur doit être complètement rempli avant de pouvoir créer un trajet. Veuillez compléter toutes les informations requises dans votre profil.",
    });
  }

  req.body.driver = req.user.id;
  const ride = await Ride.create(req.body);
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { "stats.totalTrips": 1 },
  });

  res.status(201).json({
    success: true,
    data: ride,
  });
});

exports.getRides = asyncHandler(async (req, res) => {
  let query = {};

  if (req.query.from) query["departure.city"] = new RegExp(req.query.from, "i");
  if (req.query.to) query["destination.city"] = new RegExp(req.query.to, "i");
  if (req.query.date) {
    const date = new Date(req.query.date);
    query.departureTime = {
      $gte: new Date(date.setHours(0, 0, 0)),
      $lte: new Date(date.setHours(23, 59, 59)),
    };
  }

  if (req.query.maxPrice)
    query.price = { $lte: parseFloat(req.query.maxPrice) };
  if (req.query.seats)
    query.availableSeats = { $gte: parseInt(req.query.seats) };
  if (req.query.preferences) {
    const prefs = req.query.preferences.split(",");
    prefs.forEach((pref) => {
      query[`preferences.${pref}`] = true;
    });
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Ride.countDocuments(query);

  const rides = await Ride.find(query)
    .populate("driver", "firstName lastName avatar stats.rating")
    .skip(startIndex)
    .limit(limit)
    .sort({ departureTime: "asc" });

  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }
  res.status(200).json({
    success: true,
    count: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    pagination,
    data: rides,
  });
});

exports.getRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id)
    .populate(
      "driver",
      "firstName lastName avatar stats.rating phoneNumber driverInfo email"
    )
    .populate("passengers.user", "firstName lastName avatar");

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: ride,
  });
});

exports.updateRide = asyncHandler(async (req, res, next) => {
  let ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  if (ride.driver.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Non autorisé à modifier ce trajet`, 401));
  }

  if (ride.passengers.length > 0) {
    if (req.body.availableSeats) {
      const totalBookedSeats = ride.passengers.reduce((total, passenger) => {
        if (passenger.status === "accepted") {
          return total + passenger.bookedSeats;
        }
        return total;
      }, 0);

      if (req.body.availableSeats < totalBookedSeats) {
        return next(
          new ErrorResponse(
            `Impossible de réduire le nombre de places en dessous de ${totalBookedSeats} (places déjà réservées)`,
            400
          )
        );
      }
    }

    if (req.body.departureTime) {
      const newDepartureTime = new Date(req.body.departureTime);
      const now = new Date();
      const hoursUntilDeparture = (newDepartureTime - now) / (1000 * 60 * 60);

      if (hoursUntilDeparture < 24) {
        return next(
          new ErrorResponse(
            `Impossible de modifier l'heure de départ à moins de 24h du départ`,
            400
          )
        );
      }
    }
  }

  ride = await Ride.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: ride,
  });
});

exports.deleteRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  if (!req.user) {
    return next(
      new ErrorResponse("Non autorisé - Authentification requise", 401)
    );
  }

  if (ride.driver.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`Non autorisé à supprimer ce trajet`, 401));
  }

  if (ride.passengers && ride.passengers.length > 0) {
    return next(
      new ErrorResponse(
        `Impossible de supprimer un trajet avec des réservations existantes`,
        400
      )
    );
  }

  await Promise.all([
    Ride.findByIdAndDelete(req.params.id),

    User.findByIdAndUpdate(req.user.id, {
      $inc: { "stats.totalTrips": -1 },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.bookRide = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  if (ride.driver.toString() === req.user.id) {
    return next(
      new ErrorResponse(`Vous ne pouvez pas réserver votre propre trajet`, 400)
    );
  }

  if (ride.passengers.some((p) => p.user.toString() === req.user.id)) {
    return next(new ErrorResponse(`Vous avez déjà réservé ce trajet`, 400));
  }

  const seatsRequested = req.body.seats || 1;
  if (ride.remainingSeats < seatsRequested) {
    return next(
      new ErrorResponse(`Il n'y a pas assez de places disponibles`, 400)
    );
  }

  ride.passengers.push({
    user: req.user.id,
    bookedSeats: seatsRequested,
  });

  await ride.save();

  res.status(200).json({
    success: true,
    data: ride,
  });
});

exports.cancelBooking = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  const bookingIndex = ride.passengers.findIndex(
    (p) => p.user.toString() === req.user.id
  );

  if (bookingIndex === -1) {
    return next(new ErrorResponse(`Réservation non trouvée`, 404));
  }

  const passenger = ride.passengers[bookingIndex];

  if (passenger.status !== "pending") {
    return next(
      new ErrorResponse(
        `Impossible d'annuler une réservation déjà confirmée`,
        400
      )
    );
  }

  const departureTime = new Date(ride.departureTime);
  const now = new Date();
  const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);

  if (hoursUntilDeparture < 24) {
    return next(
      new ErrorResponse(
        `Impossible d'annuler moins de 24h avant le départ`,
        400
      )
    );
  }

  ride.passengers.splice(bookingIndex, 1);
  await ride.save();

  res.status(200).json({
    success: true,
    data: ride,
  });
});

// @desc    Obtenir les trajets du conducteur connecté
exports.getMyRides = asyncHandler(async (req, res) => {
  const rides = await Ride.find({ driver: req.user.id })
    .populate("passengers.user", "firstName lastName avatar")
    .sort({ departureTime: -1 });
  console.log("my ride");
  console.log(rides);
  res.status(200).json({
    success: true,
    count: rides.length,
    data: rides,
  });
});

// @desc    Confirmer une réservation
exports.confirmBooking = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  if (ride.driver.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Non autorisé à confirmer cette réservation`, 401)
    );
  }

  const passenger = ride.passengers.find(
    (p) => p.user.toString() === req.params.passengerId
  );

  if (!passenger) {
    return next(new ErrorResponse(`Passager non trouvé`, 404));
  }

  if (passenger.status !== "pending") {
    return next(new ErrorResponse(`Cette réservation a déjà été traitée`, 400));
  }

  const totalBookedSeats = ride.passengers.reduce((total, p) => {
    if (p.status === "accepted") return total + p.bookedSeats;
    return total;
  }, 0);

  if (totalBookedSeats + passenger.bookedSeats > ride.availableSeats) {
    return next(
      new ErrorResponse(`Il n'y a plus assez de places disponibles`, 400)
    );
  }

  passenger.status = "accepted";
  await ride.save();

  res.status(200).json({
    success: true,
    data: ride,
  });
});

// @desc    Rejeter une réservation
exports.rejectBooking = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  if (ride.driver.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`Non autorisé à rejeter cette réservation`, 401)
    );
  }

  const passenger = ride.passengers.find(
    (p) => p.user.toString() === req.params.passengerId
  );

  if (!passenger) {
    return next(new ErrorResponse(`Passager non trouvé`, 404));
  }

  if (passenger.status !== "pending") {
    return next(new ErrorResponse(`Cette réservation a déjà été traitée`, 400));
  }

  passenger.status = "rejected";
  await ride.save();

  res.status(200).json({
    success: true,
    data: ride,
  });
});

exports.getMyBookings = asyncHandler(async (req, res) => {
  const rides = await Ride.find({
    "passengers.user": req.user.id,
  })
    .populate("driver", "firstName lastName avatar stats.rating")
    .populate("passengers.user", "firstName lastName avatar")
    .sort({ departureTime: -1 });

  const userRides = rides.map((ride) => {
    const userBooking = ride.passengers.find(
      (p) => p.user._id.toString() === req.user.id
    );
    return {
      ...ride.toObject(),
      status: userBooking.status,
      bookedSeats: userBooking.bookedSeats,
    };
  });

  res.status(200).json({
    success: true,
    count: userRides.length,
    data: userRides,
  });
});

exports.rateTrip = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    return next(
      new ErrorResponse(`Trajet non trouvé avec l'id ${req.params.id}`, 404)
    );
  }

  const wasPassenger = ride.passengers.some(
    (p) => p.user.toString() === req.user.id
  );
  if (!wasPassenger) {
    return next(
      new ErrorResponse(
        "Vous devez avoir été passager pour noter ce trajet",
        403
      )
    );
  }

  const existingReview = await Review.findOne({
    ride: ride._id,
    reviewer: req.user.id,
  });

  if (existingReview) {
    return next(new ErrorResponse("Vous avez déjà noté ce trajet", 400));
  }

  const review = await Review.create({
    rating: req.body.rating,
    comment: req.body.comment,
    ride: ride._id,
    reviewer: req.user.id,
    reviewedUser: ride.driver,
    type: "passenger",
  });

  const reviews = await Review.find({ reviewedUser: ride.driver });
  const avgRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await User.findByIdAndUpdate(ride.driver, {
    "stats.rating": avgRating.toFixed(1),
    "stats.reviewCount": reviews.length,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});
