var mongoose = require('mongoose');

var indicatorRecordSchema = new mongoose.Schema(
  {
    indicatorId: {
      type: String,
      required: true
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
      type: Number
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