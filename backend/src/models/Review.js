const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.ObjectId,
    ref: 'Ride',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Une note est requise'],
    min: [1, 'La note minimale est 1'],
    max: [5, 'La note maximale est 5']
  },
  comment: {
    type: String,
    maxLength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
  },
  type: {
    type: String,
    enum: ['driver', 'passenger'],
    required: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ ride: 1, reviewer: 1 }, { unique: true });

reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const User = require('./User');

  const stats = await Review.aggregate([
    {
      $match: { reviewedUser: this.reviewedUser }
    },
    {
      $group: {
        _id: '$reviewedUser',
        averageRating: { $avg: '$rating' },
        numberOfRatings: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(this.reviewedUser, {
      'stats.rating': Math.round(stats[0].averageRating * 10) / 10,
      'stats.numberOfRatings': stats[0].numberOfRatings
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema);
