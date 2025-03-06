const express = require('express');
const {
  getProfile,
  updateProfile,
  updateDriverProfile,
  updatePreferences,
  uploadProfilePhoto,
  getUserTrips,
  getPublicProfile
} = require('../controllers/userController');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

// Protéger toutes les routes
router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/me/driver', updateDriverProfile);
router.put('/me/preferences', updatePreferences);
router.put('/me/photo', uploadProfilePhoto);
router.get('/me/trips', getUserTrips);

// Route publique (mais toujours protégée par authentification)
router.get('/:id', getPublicProfile);

module.exports = router;
