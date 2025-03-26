const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const path = require("path");
const fs = require("fs");
const Ride = require("../models/Ride");

exports.getProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const avatarUrl = user.avatar?.data
      ? `data:${user.avatar.contentType};base64,${user.avatar.data}`
      : null;

    const userResponse = user.toObject();
    delete userResponse.avatar;
    userResponse.avatarUrl = avatarUrl;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
    });
  }
});

exports.getPassengerStats = asyncHandler(async (req, res) => {
  const stats = await Ride.aggregate([
    {
      $match: {
        "passengers.user": req.user._id,
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalTrips: { $sum: 1 },
        totalDistance: { $sum: "$distance" },
        averageRating: { $avg: "$passengers.rating" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {
      totalTrips: 0,
      totalDistance: 0,
      averageRating: 0,
    },
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    console.log("Données reçues:", req.body);

    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({
        success: false,
        message: "Prénom, nom et email sont requis",
      });
    }

    const existingUser = await User.findOne({
      email: req.body.email,
      _id: { $ne: req.user.id },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Cet email est déjà utilisé",
      });
    }

    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    };

    if (req.body.phoneNumber) {
      updateData.phoneNumber = req.body.phoneNumber;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

exports.updateDriverProfile = asyncHandler(async (req, res, next) => {
  try {
    console.log("Mise à jour du profil conducteur - Données reçues:", req.body);

    if (req.user.role !== "driver") {
      return next(
        new ErrorResponse(
          "Seuls les conducteurs peuvent mettre à jour ces informations",
          403
        )
      );
    }

    const fieldsToUpdate = {
      "driverInfo.carModel": req.body.carModel,
      "driverInfo.carYear": req.body.carYear,
      "driverInfo.licensePlate": req.body.licensePlate,
    };

    console.log("Champs à mettre à jour:", fieldsToUpdate);

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    console.log("Utilisateur mis à jour:", user);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil conducteur:", error);
    next(error);
  }
});

exports.updatePreferences = asyncHandler(async (req, res) => {
  const preferences = {
    "preferences.language": req.body.language || "fr",
    "preferences.currency": req.body.currency || "MAD",
    "preferences.notifications": {
      email:
        req.body.emailNotifications !== undefined
          ? req.body.emailNotifications
          : true,
      push:
        req.body.pushNotifications !== undefined
          ? req.body.pushNotifications
          : true,
    },
    "preferences.travelPreferences": {
      smoking: req.body.smoking !== undefined ? req.body.smoking : false,
      music: req.body.music !== undefined ? req.body.music : true,
      pets: req.body.pets !== undefined ? req.body.pets : false,
      conversation: req.body.conversation || "moderate",
    },
  };

  const user = await User.findByIdAndUpdate(req.user.id, preferences, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  try {
    console.log("Upload request received:", {
      hasFiles: !!req.files,
      fileKeys: req.files ? Object.keys(req.files) : [],
    });

    if (!req.files || !req.files.photo) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier n'a été uploadé",
      });
    }

    const file = req.files.photo;

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Le fichier doit être une image",
      });
    }

    const base64Data = Buffer.from(file.data).toString("base64");

    console.log("File processing:", {
      originalName: file.name,
      size: file.size,
      mimeType: file.mimetype,
      base64Length: base64Data.length,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatar: {
          data: base64Data,
          contentType: file.mimetype,
        },
      },
      { new: true }
    );

    if (!updatedUser.avatar?.data) {
      throw new Error("Échec de la sauvegarde des données de l'image");
    }

    console.log("Update successful:", {
      userId: updatedUser._id,
      hasData: !!updatedUser.avatar?.data,
      dataLength: updatedUser.avatar?.data?.length,
    });

    res.status(200).json({
      success: true,
      data: {
        avatarUrl: `data:${file.mimetype};base64,${base64Data}`,
      },
      message: "Photo de profil mise à jour avec succès",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload de la photo",
      error: error.message,
    });
  }
});

exports.getUserTrips = asyncHandler(async (req, res) => {
  const rides = await Ride.find({
    $or: [{ driver: req.user.id }, { "passengers.user": req.user.id }],
  })
    .populate("driver", "firstName lastName avatar")
    .populate("passengers.user", "firstName lastName avatar")
    .sort({ departureTime: -1 });

  res.status(200).json({
    success: true,
    count: rides.length,
    data: rides,
  });
});

exports.getPublicProfile = asyncHandler(async (req, res, next) => {
  try {
    console.log("Fetching public profile for user ID:", req.params.id);

    const user = await User.findById(req.params.id)
      .select(
        "firstName lastName email phoneNumber avatar stats role driverInfo createdAt"
      )
      .lean();

    console.log("User found:", user ? "Yes" : "No");
    console.log("Driver info:", user?.driverInfo);

    if (!user) {
      return next(new ErrorResponse("Utilisateur non trouvé", 404));
    }


    console.log("Sending response with user data:", {
      hasDriverInfo: !!user.driverInfo,
      driverInfo: user.driverInfo,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getPublicProfile:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du profil",
      error: error.message,
    });
  }
});

exports.checkUploads = asyncHandler(async (req, res) => {
  const uploadsDir = path.join(__dirname, "../../uploads");
  const files = fs.readdirSync(uploadsDir);

  res.json({
    success: true,
    uploadsDir,
    files,
    exists: fs.existsSync(uploadsDir),
  });
});
