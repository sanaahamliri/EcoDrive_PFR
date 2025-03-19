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
  rejectBooking,
  getMyBookings,
  rateTrip
} = require('../controllers/rideController');

const router = express.Router();
const { protect } = require('../middlewares/auth');

// Public routes
router.get('/', getRides);

// Protected routes - specific routes first
router.get('/my-rides', protect, getMyRides);
router.get('/my-bookings', protect, getMyBookings);
router.post('/', protect, createRide);

// Parameterized routes
router.get('/:id', getRide);
router
  .route('/:id')
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

// Route pour la notation
router.post('/:id/rate', protect, rateTrip);

module.exports = router;
