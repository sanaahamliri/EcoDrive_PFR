const express = require('express');
const {
  createRide,
  getRides,
  getRide,
  updateRide,
  deleteRide,
  bookRide,
  cancelBooking,
  getMyRides,
  confirmBooking,
  rejectBooking
} = require('../controllers/rideController');

const router = express.Router();

const { protect } = require('../middlewares/auth');

router.get('/my-rides', protect, getMyRides);

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

router
  .route('/:id/passengers/:passengerId/confirm')
  .post(protect, confirmBooking);

router
  .route('/:id/passengers/:passengerId/reject')
  .post(protect, rejectBooking);

module.exports = router;
