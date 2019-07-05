const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    favoriteBeer: {
      type: String,
      required: false
    },
    profileImage: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: true
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    nextBeerDate: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Friend', PlaceSchema);
