const express = require('express');
const {
  createRide,
  getRides,
  getRide,
  updateRide,
  deleteRide,
  bookRide,
  cancelBooking,
  getMyRides
} = require('../controllers/rideController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router
  .route('/')
  .get(getRides)
  .post(protect, createRide);

router
  .route('/:id')
  .get(getRide)
  .put(protect, updateRide)
  .delete(protect, deleteRide);

router
  .route('/:id/book')
  .post(protect, bookRide)
  .delete(protect, cancelBooking);

router.get('/my-rides', protect, getMyRides);

module.exports = router;
