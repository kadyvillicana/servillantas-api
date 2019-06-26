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
    condemnatory:{
      type: Number,
      default: 0
    },
    absolut:{
      type: Number,
      default: 0
    },
    condemnedPeople:{
      type: Number,
      default: 0
    },
    victimNumber:{
      type: Number,
      default: 0
    },
    gender: {
      type: {
        male: {
          type: Number
        },
        female: {
          type: Number
        }
      },
      default: { male: 0, female: 0 }
    },
    investigationFolder: {
      type: {
        complaint: {
          type: Number
        },
        judicialHearing: {
          type: Number
        },
        otherReasons: {
          type: Number
        }
      },
      default: { complaint: 0, judicialHearing: 0, otherReasons: 0 }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('IndicatorRecord', indicatorRecordSchema);