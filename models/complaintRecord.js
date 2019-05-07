var mongoose = require('mongoose');

var ComplaintRecordSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: String
    },
    states: [
      {
        state: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Place'
        },
        amount: {
          type: Number
        },
        gender: {
          type: String
        },
        responsibleAuthority: {
          type: String
        },
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ComplaintRecord', ComplaintRecordSchema);