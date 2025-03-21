const express = require("express");
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getTripReviews,
} = require("../controllers/reviewController");

const router = express.Router();

const { protect } = require("../middlewares/auth");

router.route("/").get(getReviews).post(protect, createReview);

router.route("/trip/:tripId").get(protect, getTripReviews);

router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
