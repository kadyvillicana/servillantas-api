const mongoose          = require('mongoose');
const ERRORS    = require('../constants/errors');

const ItemSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      default: 0
    },
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
      required: true,
      default: 0
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
ItemSchema.pre('save', async function(next) {
  if (this.isNew) {
    const item = this;
    const totalItems = await mongoose.model('Item', ItemSchema).countDocuments();
    const number = totalItems + 1;
    item.number = number;
    item.position = number * 10;
  }
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
    .findOne({ name: value, deleted: false })
    .collation({ locale: 'es', strength: 1 });
  if (item && item._id.toString() !== this._id.toString()) {
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
ItemSchema.path('shortName').validate(async function (value) {
  const item = await mongoose.model('Item', ItemSchema)
    .findOne({ shortName: value, deleted: false })
    .collation({ locale: 'es', strength: 1 });
  if (item && item._id.toString() !== this._id.toString()) {
    return false;
  }

  return true;
}, ERRORS.DUPLICATE_SHORTNAME);

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
    number: item.number,
    name: item.name,
    shortName: item.shortName,
    description: item.description,
    hasIndicators: item.hasIndicators,
    position: item.position,
    title: item.title,
    content: item.content,
    coverImage: item.coverImage,
    sliderImages: item.sliderImages
  }
};

module.exports = mongoose.model('Item', ItemSchema);
