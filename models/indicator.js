const mongoose            = require('mongoose');
const ObjectId            = mongoose.Types.ObjectId;
const ERRORS              = require('../constants/errors');
const Record              = require('../models/indicatorRecord');

const IndicatorSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item'
  },
  number: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true
  },
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
  },
  specialTreatment: String,
  indicatorWeaknesses: String,
  sources: [{ type: String }],
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add index to speed search of duplicated names
// use 'es' collation and strngth 1 to ignore sensitive case and diacritics
IndicatorSchema.index({ name: -1}, { collation: { locale: 'es', strength: 1 }});
IndicatorSchema.index({ shortName: -1}, { collation: { locale: 'es', strength: 1 }});

/**
 * Add the position of this item.
 */
IndicatorSchema.pre('save', async function(next) {
  if (this.isNew) {
    const indicator = this;
    const total = await mongoose.model('Indicator', IndicatorSchema).countDocuments({ deleted: false });
    const number = total + 1;
    indicator.number = number;
  }
  next();
});

/**
 * Validate there are no items with duplicated name.
 * 
 * Ignore the validation if the item found is the one
 * being updated.
 */
IndicatorSchema.path('name').validate(async function (value) {
  const indicator = await mongoose.model('Indicator', IndicatorSchema)
    .findOne({ name: value, deleted: false })
    .collation({ locale: 'es', strength: 1 });
  if (indicator && indicator._id.toString() !== this._id.toString()) {
    return false;
  }

  return true;
}, ERRORS.DUPLICATE_NAME);

/**
 * Validate there are no items with duplicated shortName.
 * 
 * Ignore the validation if the item found is the one
 * being updated.
 */
IndicatorSchema.path('shortName').validate(async function (value) {
  const indicator = await mongoose.model('Indicator', IndicatorSchema)
    .findOne({ shortName: value, deleted: false })
    .collation({ locale: 'es', strength: 1 });
  if (indicator && indicator._id.toString() !== this._id.toString()) {
    return false;
  }

  return true;
}, ERRORS.DUPLICATE_SHORTNAME);

IndicatorSchema.methods.toJsonResponse = async function() {
  const indicator = await this
    .populate({ path: 'itemId', select: '_id name shortName', match: { deleted: false } })
    .populate({ path: 'updatedBy', select: '_id, name lastName' })
    .execPopulate();

  const record = await Record.findOne({ indicator: ObjectId(indicator._id ) });

  return {
    _id: indicator._id,
    itemId: indicator.itemId,
    number: indicator.number,
    name: indicator.name,
    shortName: indicator.shortName,
    definition: indicator.definition,
    calculationMethod: indicator.calculationMethod,
    measurementFrequency: indicator.measurementFrequency,
    geographicBreakdown: indicator.geographicBreakdown,
    specialTreatment: indicator.specialTreatment,
    indicatorWeaknesses: indicator.indicatorWeaknesses,
    sources: indicator.sources,
    updatedAt: indicator.updatedAt,
    updatedBy: indicator.updatedBy,
    hasRecords: !!record,
  }
}

module.exports = mongoose.model('Indicator', IndicatorSchema);