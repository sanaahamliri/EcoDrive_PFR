const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxLength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxLength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'driver', 'admin'],
    default: 'user'
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^(\+212|0)([ \-_/]*)(\d[ \-_/]*){9}$/, 'Veuillez fournir un numéro de téléphone valide']
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Pour les conducteurs
  driverInfo: {
    carModel: String,
    carYear: Number,
    licensePlate: String,
    drivingLicense: String,
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  // Statistiques utilisateur
  stats: {
    totalTrips: {
      type: Number,
      default: 0
    },
    totalDistance: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0
    },
    numberOfRatings: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Crypter le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Générer le token JWT
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Vérifier le mot de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Générer et hasher le token de réinitialisation du mot de passe
userSchema.methods.getResetPasswordToken = function() {
  // Générer le token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hasher le token et définir resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Définir l'expiration
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
