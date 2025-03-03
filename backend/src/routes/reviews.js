const express = require('express');
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router
  .route('/')
  .get(getReviews)
  .post(protect, createReview);

router
  .route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
