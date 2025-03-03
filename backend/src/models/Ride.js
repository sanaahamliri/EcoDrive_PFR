const mongoose = require('mongoose');

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
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  destination: {
    city: {
      type: String,
      required: [true, 'La ville de destination est requise']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  departureTime: {
    type: Date,
    required: [true, 'L\'heure de départ est requise']
  },
  estimatedArrivalTime: {
    type: Date,
    required: [true, 'L\'heure d\'arrivée estimée est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis']
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
      ref: 'User'
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
    },
    airConditioned: {
      type: Boolean,
      default: true
    }
  },
  route: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: {
      type: [[Number]],
      required: true
    }
  },
  distance: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    maxLength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  recurrence: {
    isRecurrent: {
      type: Boolean,
      default: false
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', null],
      default: null
    },
    endDate: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexer les champs géographiques
rideSchema.index({ 'departure.location': '2dsphere' });
rideSchema.index({ 'destination.location': '2dsphere' });
rideSchema.index({ 'route': '2dsphere' });

// Virtual pour le nombre de places réservées
rideSchema.virtual('bookedSeats').get(function() {
  return this.passengers.reduce((total, passenger) => {
    if (passenger.status === 'accepted') {
      return total + passenger.bookedSeats;
    }
    return total;
  }, 0);
});

// Virtual pour le nombre de places restantes
rideSchema.virtual('remainingSeats').get(function() {
  return this.availableSeats - this.bookedSeats;
});

// Middleware pour vérifier les places disponibles
rideSchema.pre('save', function(next) {
  if (this.bookedSeats > this.availableSeats) {
    next(new Error('Le nombre de places réservées ne peut pas dépasser le nombre de places disponibles'));
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);
