const Review = require("../models/Review");
const Ride = require("../models/Ride");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const mongoose = require("mongoose");


exports.createReview = asyncHandler(async (req, res, next) => {
  const ride = await Ride.findById(req.body.ride);

  if (!ride) {
    return next(new ErrorResponse("Trajet non trouvé", 404));
  }

  if (new Date(ride.departureTime) > new Date()) {
    return next(
      new ErrorResponse("Vous ne pouvez noter qu'un trajet terminé", 400)
    );
  }

  const wasPassenger = ride.passengers.some(
    (p) => p.user.toString() === req.user.id
  );
  const wasDriver = ride.driver.toString() === req.user.id;

  if (!wasPassenger && !wasDriver) {
    return next(
      new ErrorResponse(
        "Vous devez avoir participé au trajet pour le noter",
        403
      )
    );
  }

  const existingReview = await Review.findOne({
    ride: req.body.ride,
    reviewer: req.user.id,
  });

  if (existingReview) {
    return next(new ErrorResponse("Vous avez déjà noté ce trajet", 400));
  }

  const review = await Review.create({
    rating: req.body.rating,
    ride: req.body.ride,
    reviewer: req.user.id,
    reviewedUser: wasPassenger ? ride.driver : ride.passengers[0].user,
    type: wasPassenger ? "driver" : "passenger",
  });

  await updateUserRating(review.reviewedUser);

  res.status(201).json({
    success: true,
    data: review,
  });
});

exports.getReviews = asyncHandler(async (req, res) => {
  let query = {};

  if (req.query.user) {
    query.reviewedUser = req.query.user;
  }

  if (req.query.ride) {
    query.ride = req.query.ride;
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Review.countDocuments(query);

  const reviews = await Review.find(query)
    .populate({
      path: "reviewer",
      select: "firstName lastName avatar",
    })
    .populate({
      path: "reviewedUser",
      select: "firstName lastName avatar stats",
    })
    .populate({
      path: "ride",
      select: "departure destination departureTime",
    })
    .skip(startIndex)
    .limit(limit)
    .sort("-createdAt");

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
    data: reviews,
  });
});

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("Avis non trouvé", 404));
  }

  if (review.reviewer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Non autorisé à modifier cet avis", 401));
  }

  const hours = Math.abs(new Date() - review.createdAt) / 36e5;
  if (hours > 48) {
    return next(
      new ErrorResponse("Impossible de modifier un avis après 48h", 400)
    );
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    { rating: req.body.rating },
    { new: true, runValidators: true }
  );

  const reviews = await Review.find({ reviewedUser: review.reviewedUser });
  const avgRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await User.findByIdAndUpdate(review.reviewedUser, {
    "stats.rating": avgRating.toFixed(1),
  });

  res.status(200).json({
    success: true,
    data: review,
  });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("Avis non trouvé", 404));
  }

  if (review.reviewer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Non autorisé à supprimer cet avis", 401));
  }

  await review.remove();

  const reviews = await Review.find({ reviewedUser: review.reviewedUser });
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0;

  await User.findByIdAndUpdate(review.reviewedUser, {
    "stats.rating": avgRating.toFixed(1),
    "stats.reviewCount": reviews.length,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

exports.getTripReviews = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  console.log("Received request for trip reviews:", tripId); // Debug log

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid trip ID format",
    });
  }

  const reviews = await Review.find({ ride: tripId })
    .populate({
      path: "reviewer",
      select: "firstName lastName avatar",
    })
    .populate({
      path: "reviewedUser",
      select: "firstName lastName avatar stats",
    });

  console.log("Found reviews:", reviews.length); 

  const userReview = reviews.find(
    (review) => review.reviewer._id.toString() === userId
  );

  res.status(200).json({
    success: true,
    data: {
      reviews,
      userReview,
    },
  });
});

const updateUserRating = async (userId) => {
  const stats = await Review.aggregate([
    {
      $match: { reviewedUser: mongoose.Types.ObjectId(userId) },
    },
    {
      $group: {
        _id: "$reviewedUser",
        averageRating: { $avg: "$rating" },
        numberOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      "stats.rating": Math.round(stats[0].averageRating * 10) / 10,
      "stats.reviewCount": stats[0].numberOfReviews,
    });
  }
};
