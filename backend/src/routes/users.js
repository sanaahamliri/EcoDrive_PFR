const express = require("express");
const {
  getProfile,
  updateProfile,
  updateDriverProfile,
  updatePreferences,
  uploadProfilePhoto,
  getUserTrips,
  getPublicProfile,
  checkUploads,
} = require("../controllers/userController");
const User = require("../models/User");

const router = express.Router();

const { protect, authorize } = require("../middlewares/auth");

// Protéger toutes les routes
router.use(protect);

router.get("/me", getProfile);
router.put("/me", updateProfile);
router.put("/me/driver", updateDriverProfile);
router.put("/me/preferences", updatePreferences);
router.put("/me/photo", uploadProfilePhoto);
router.get("/me/trips", getUserTrips);

// Route publique (mais toujours protégée par authentification)
router.get("/:id", getPublicProfile);

router.get("/check-uploads", checkUploads);

// Ajouter cette route pour tester
router.get("/test-avatar", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      avatarInfo: {
        hasAvatar: !!user.avatar,
        hasData: !!(user.avatar && user.avatar.data),
        dataLength: user.avatar?.data?.length,
        contentType: user.avatar?.contentType,
        sampleData: user.avatar?.data?.substring(0, 100),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
