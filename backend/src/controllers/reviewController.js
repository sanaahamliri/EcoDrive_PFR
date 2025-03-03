const Review = require('../models/Review');
const Ride = require('../models/Ride');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

exports.createReview = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.body.ride);
  
  if (!ride) {
    return next(new ErrorResponse('Trajet non trouvé', 404));
  }

  // Vérifier que le trajet est terminé
  if (new Date(ride.departureTime) > new Date()) {
    return next(new ErrorResponse('Vous ne pouvez noter qu\'un trajet terminé', 400));
  }

  // Vérifier que l'utilisateur était passager ou conducteur
  const wasPassenger = ride.passengers.some(p => p.user.toString() === req.user.id);
  const wasDriver = ride.driver.toString() === req.user.id;

  if (!wasPassenger && !wasDriver) {
    return next(new ErrorResponse('Vous devez avoir participé au trajet pour le noter', 403));
  }

  // Vérifier si l'utilisateur a déjà noté ce trajet
  const existingReview = await Review.findOne({
    ride: req.body.ride,
    reviewer: req.user.id
  });

  if (existingReview) {
    return next(new ErrorResponse('Vous avez déjà noté ce trajet', 400));
  }

  // Créer la review
  const review = await Review.create({
    rating: req.body.rating,
    comment: req.body.comment,
    ride: req.body.ride,
    reviewer: req.user.id,
    reviewedUser: wasPassenger ? ride.driver : ride.passengers[0].user
  });

  // Mettre à jour la note moyenne de l'utilisateur noté
  const reviews = await Review.find({ reviewedUser: review.reviewedUser });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await User.findByIdAndUpdate(review.reviewedUser, {
    'stats.rating': avgRating.toFixed(1),
    'stats.reviewCount': reviews.length
  });

  res.status(201).json({
    success: true,
    data: review
  });
});

exports.getReviews = asyncHandler(async (req, res) => {
  let query = {};

  // Filtrer par utilisateur noté
  if (req.query.user) {
    query.reviewedUser = req.query.user;
  }

  // Filtrer par trajet
  if (req.query.ride) {
    query.ride = req.query.ride;
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate({
      path: 'reviewer',
      select: 'firstName lastName avatar'
    })
    .populate({
      path: 'reviewedUser',
      select: 'firstName lastName avatar'
    })
    .populate({
      path: 'ride',
      select: 'departure destination departureTime'
    })
    .skip(startIndex)
    .limit(limit)
    .sort('-createdAt');

  // Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination,
    data: reviews
  });
});

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Avis non trouvé', 404));
  }

  // Vérifier que c'est bien l'auteur qui modifie
  if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Non autorisé à modifier cet avis', 401));
  }

  // Empêcher la modification après 48h
  const hours = Math.abs(new Date() - review.createdAt) / 36e5;
  if (hours > 48) {
    return next(new ErrorResponse('Impossible de modifier un avis après 48h', 400));
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    { rating: req.body.rating, comment: req.body.comment },
    { new: true, runValidators: true }
  );

  // Mettre à jour la note moyenne
  const reviews = await Review.find({ reviewedUser: review.reviewedUser });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await User.findByIdAndUpdate(review.reviewedUser, {
    'stats.rating': avgRating.toFixed(1)
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse('Avis non trouvé', 404));
  }

  // Vérifier que c'est bien l'auteur qui supprime
  if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Non autorisé à supprimer cet avis', 401));
  }

  await review.remove();

  // Mettre à jour la note moyenne
  const reviews = await Review.find({ reviewedUser: review.reviewedUser });
  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    : 0;

  await User.findByIdAndUpdate(review.reviewedUser, {
    'stats.rating': avgRating.toFixed(1),
    'stats.reviewCount': reviews.length
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});
