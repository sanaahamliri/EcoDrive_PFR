const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const sendEmail = require('../utils/sendEmail');

// @desc    S'inscrire
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role, phoneNumber } = req.body;

  // Créer l'utilisateur
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'user',
    phoneNumber
  });

  // Créer le token de vérification
  const verificationToken = crypto.randomBytes(20).toString('hex');
  user.verificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 heures

  await user.save();

  // Envoyer l'email de vérification
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/${verificationToken}`;
  const message = `Vous recevez cet email car vous venez de vous inscrire sur EcoDrive. Pour vérifier votre compte, cliquez sur ce lien : \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Vérification de votre compte EcoDrive',
      message
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    return next(new ErrorResponse('Email de vérification non envoyé', 500));
  }
});

// @desc    Se connecter
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Valider l'email et le mot de passe
  if (!email || !password) {
    return next(new ErrorResponse('Veuillez fournir un email et un mot de passe', 400));
  }

  // Vérifier l'utilisateur
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ErrorResponse('Identifiants invalides', 401));
  }

  // Vérifier si le mot de passe correspond
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Identifiants invalides', 401));
  }

  // Vérifier si le compte est vérifié
  if (!user.isVerified) {
    return next(new ErrorResponse('Veuillez vérifier votre compte email', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Déconnexion
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Obtenir l'utilisateur actuel
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Mettre à jour les détails de l'utilisateur
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
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

// @desc    Mettre à jour le mot de passe
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Vérifier le mot de passe actuel
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Mot de passe incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Mot de passe oublié
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('Aucun utilisateur trouvé avec cet email', 404));
  }

  // Obtenir le token de réinitialisation
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Créer l'URL de réinitialisation
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe. Pour le réinitialiser, cliquez sur ce lien : \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Réinitialisation de votre mot de passe EcoDrive',
      message
    });

    res.status(200).json({
      success: true,
      data: 'Email envoyé'
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email non envoyé', 500));
  }
});

// @desc    Réinitialiser le mot de passe
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Obtenir le token hashé
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Token invalide', 400));
  }

  // Définir le nouveau mot de passe
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Vérifier le compte email
// @route   GET /api/v1/auth/verify/:verificationToken
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Obtenir le token hashé
  const verificationToken = crypto
    .createHash('sha256')
    .update(req.params.verificationToken)
    .digest('hex');

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Token invalide', 400));
  }

  // Activer le compte
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};
