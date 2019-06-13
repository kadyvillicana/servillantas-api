const mongoose          = require('mongoose');
const DUPLICATE_NAME    = require('../constants/errors').DUPLICATE_NAME;

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    shortName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: 1024,
    },
    hasIndicators: {
      type: Boolean,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ItemImage'
    },
    title: {
      type: String,
      required: [
        function () { return !this.hasIndicators },
        'title is required if this item has no indicators'
      ]
    },
    content: {
      type: String,
      required: [
        function () { return !this.hasIndicators },
        'content is required if this item has no indicators'
      ]
    },
    sliderImages: {
      type: [{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'ItemImage'
      }],
      validate: [sliderImagesMaxLength, '{PATH exceeds the limit of 3}'],
      default: undefined
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Add index to speed search of duplicated names
// use 'es' collation and strngth 1 to ignore sensitive case and diacritics
ItemSchema.index({ name: -1}, { collation: { locale: 'es', strength: 1 }});


/**
 * Validate there are no items with more than 3 images in the slider.
 */
function sliderImagesMaxLength (val) {
  return val.length < 4;
}

/**
 * Add the position of this item.
 */
ItemSchema.pre('validate', async function (next) {
  // If no position is set, calculate it
  if (this.position) {
    return next();
  }
  const totalItems = await mongoose.model('Item', ItemSchema).countDocuments();
  this.position = (totalItems + 1) * 10;
  next();
});

/**
 * Validate there are no items with duplicated name.
 * 
 * Ignore the validation if the item found is the one
 * being updated.
 */
ItemSchema.path('name').validate(async function (value) {
  const item = await mongoose.model('Item', ItemSchema)
    .findOne({ name: value })
    .collation({ locale: 'es', strength: 1 });
  if (item && item._id.toString() !== this._id.toString()) {
    return false;
  }

  return true;
}, DUPLICATE_NAME);

/**
 * Populate fields and ignore the properties that
 * the app won't need.
 */
ItemSchema.methods.toJsonResponse = async function() {
  const item = await this
    .populate('coverImage', 'url')
    .populate('sliderImages', 'url')
    .execPopulate();

  return {
    _id: item._id,
    name: item.name,
    shortName: item.shortName,
    hasIndicators: item.hasIndicators,
    title: item.title,
    content: item.content,
    coverImage: item.coverImage,
    sliderImages: item.sliderImages
  }
};

module.exports = mongoose.model('Item', ItemSchema);
