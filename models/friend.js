const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');

const FriendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
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
    },
  },
  {
    timestamps: true
  }
);

FriendSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today)
  expirationDate.setDate(today.getDate() + 365);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, process.env.PASSPORT_SECRET);
}

FriendSchema.methods.authJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    profileImage: this.profileImage,
    favoriteBeer: this.favoriteBeer
  }
}

module.exports = mongoose.model('Friend', FriendSchema);
