var mongoose = require('mongoose');

var PlaceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Place', PlaceSchema);
