const mongoose = require('mongoose');

const indicatorRecordSchema = new mongoose.Schema(
  {
    indicator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Indicator'
    },
    date: {
      type: Date,
      required: true
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place'
    },
    amount: {
      type: Number,
      default: 0
    },
    hash: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('IndicatorRecord', indicatorRecordSchema);