const mongoose = require('mongoose');

const ShortURLSchema = new mongoose.Schema(
  {
    originalURL: {
      type: String,
      required: true
    },
    URLCode: {
      type: String,
      required: true
    },
    shortURL: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ShortURL', ShortURLSchema);