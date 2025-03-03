const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate({
      path: 'stats.totalTrips',
      select: 'departure destination departureTime'
    });

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.updateDriverProfile = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'driver') {
    return next(new ErrorResponse('Seuls les conducteurs peuvent mettre à jour ces informations', 403));
  }

  const fieldsToUpdate = {
    'driverInfo.carModel': req.body.carModel,
    'driverInfo.carYear': req.body.carYear,
    'driverInfo.licensePlate': req.body.licensePlate
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.updatePreferences = asyncHandler(async (req, res) => {
  const preferences = {
    'preferences.language': req.body.language || 'fr',
    'preferences.currency': req.body.currency || 'MAD',
    'preferences.notifications': {
      email: req.body.emailNotifications !== undefined ? req.body.emailNotifications : true,
      push: req.body.pushNotifications !== undefined ? req.body.pushNotifications : true
    },
    'preferences.travelPreferences': {
      smoking: req.body.smoking !== undefined ? req.body.smoking : false,
      music: req.body.music !== undefined ? req.body.music : true,
      pets: req.body.pets !== undefined ? req.body.pets : false,
      conversation: req.body.conversation || 'moderate'
    }
  };

  const user = await User.findByIdAndUpdate(req.user.id, preferences, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

exports.uploadProfilePhoto = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.photo) {
    return next(new ErrorResponse('Veuillez télécharger une photo', 400));
  }

  const file = req.files.photo;

  // Vérifier que c'est une image
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Le fichier doit être une image', 400));
  }

  // Vérifier la taille
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`La taille de l'image ne doit pas dépasser ${process.env.MAX_FILE_UPLOAD / 1000000}MB`, 400));
  }

  // Créer un nom de fichier personnalisé
  file.name = `photo_${req.user.id}${path.parse(file.name).ext}`;

  // Déplacer le fichier
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problème lors du téléchargement du fichier', 500));
    }

    await User.findByIdAndUpdate(req.user.id, { avatar: file.name });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});

exports.getUserTrips = asyncHandler(async (req, res) => {
  const rides = await Ride.find({
    $or: [
      { driver: req.user.id },
      { 'passengers.user': req.user.id }
    ]
  })
  .populate('driver', 'firstName lastName avatar')
  .populate('passengers.user', 'firstName lastName avatar')
  .sort({ departureTime: -1 });

  res.status(200).json({
    success: true,
    count: rides.length,
    data: rides
  });
});

exports.getPublicProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('firstName lastName avatar stats role driverInfo.carModel createdAt')
    .populate({
      path: 'reviews',
      select: 'rating comment createdAt',
      populate: {
        path: 'reviewer',
        select: 'firstName lastName avatar'
      }
    });

  if (!user) {
    return next(new ErrorResponse('Utilisateur non trouvé', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});
