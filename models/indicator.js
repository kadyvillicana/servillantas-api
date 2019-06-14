var mongoose = require('mongoose');

var IndicatorSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  number: {
    type: Number,
    default: 0
  },
  version: String,
  indicatorId: String,
  name: String,
  shortName: String,
  definition: String,
  calculationMethod: {
    formula: String,
    numerator: String,
    denominator: String
  },
  measurementFrequency: {
    annual: Boolean,
    quarterly: Boolean,
    monthly: Boolean
  },
  geographicBreakdown: {
    federal: Boolean,
    state: Boolean,
    municipal: Boolean,
    national: Boolean
  },
  specialTreatment: String,
  indicatorWeaknesses: String,

  processedIndicator: String,
  source: [{ type: String }],
  recollectionMethod: String,
  disintegration: String,
}, {
  timestamps: true
});

/**
 * Add the position of this item.
 */
IndicatorSchema.pre('save', async function(next) {
  if (this.isNew) {
    const indicator = this;
    const total = await mongoose.model('Indicator', IndicatorSchema).countDocuments();
    const number = total + 1;
    indicator.number = number;
  }
  next();
});

module.exports = mongoose.model('Indicator', IndicatorSchema);