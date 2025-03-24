const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
      minlength: [2, "Le prénom doit contenir au moins 2 caractères"],
      maxlength: [50, "Le prénom ne peut pas dépasser 50 caractères"],
    },
    lastName: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
      maxlength: [50, "Le nom ne peut pas dépasser 50 caractères"],
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir un email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "driver", "admin"],
      default: "user",
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      match: [/^[0-9+\s-]*$/, "Format de téléphone invalide"],
    },
    avatar: {
      data: {
        type: String,
        required: false,
      },
      contentType: {
        type: String,
        required: false,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    driverInfo: {
      carModel: String,
      carYear: Number,
      licensePlate: String,
      drivingLicense: String,
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    stats: {
      totalTrips: {
        type: Number,
        default: 0,
      },
      totalDistance: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 0,
      },
      numberOfRatings: {
        type: Number,
        default: 0,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET || "secret_dev_123456",
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.isDriverProfileComplete = function () {
  if (this.role !== "driver") return false;

  return (
    this.firstName &&
    this.lastName &&
    this.email &&
    this.phoneNumber &&
    this.driverInfo?.carModel &&
    this.driverInfo?.carYear &&
    this.driverInfo?.licensePlate
  );
};

module.exports = mongoose.model("User", userSchema);
