const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const rideSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  departure: {
    city: {
      type: String,
      required: [true, 'La ville de départ est requise']
    },
    address: {
      type: String,
      required: [true, 'L\'adresse de départ est requise']
    },
    coordinates: pointSchema
  },
  destination: {
    city: {
      type: String,
      required: [true, 'La ville de destination est requise']
    },
    address: {
      type: String,
      required: [true, 'L\'adresse de destination est requise']
    },
    coordinates: pointSchema
  },
  departureTime: {
    type: Date,
    required: [true, 'L\'heure de départ est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix doit être positif']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Le nombre de places disponibles est requis'],
    min: [1, 'Il doit y avoir au moins une place disponible'],
    max: [8, 'Le nombre maximum de places est 8']
  },
  passengers: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending'
    },
    bookedSeats: {
      type: Number,
      default: 1
    },
    bookingTime: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  preferences: {
    smoking: {
      type: Boolean,
      default: false
    },
    music: {
      type: Boolean,
      default: true
    },
    pets: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

rideSchema.index({ 'departure.coordinates': '2dsphere' });
rideSchema.index({ 'destination.coordinates': '2dsphere' });

rideSchema.virtual('bookedSeats').get(function() {
  return this.passengers.reduce((total, passenger) => {
    if (passenger.status === 'accepted') {
      return total + passenger.bookedSeats;
    }
    return total;
  }, 0);
});

rideSchema.virtual('remainingSeats').get(function() {
  return this.availableSeats - this.bookedSeats;
});

rideSchema.pre('save', function(next) {
  if (this.bookedSeats > this.availableSeats) {
    return next(new Error('Le nombre total de places réservées ne peut pas dépasser le nombre de places disponibles.'));
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);
