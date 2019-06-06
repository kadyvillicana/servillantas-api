const mongoose = require('mongoose');

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
    hasIndicators: {
      type: Boolean,
      required: true
    },
    coverImage: {
      type: String
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
      type: [String],
      validate: [sliderImagesMaxLength, '{PATH} exceeds the limit of 3']
    },
  },
  {
    timestamps: true
  }
);

function sliderImagesMaxLength (val) {
  return val.length < 4;
}

ItemSchema.path('name').validate(async (value) => {
  const item = await mongoose.model('Item', ItemSchema).findOne({ name: value });
  return !item;
}, 'Name already exists');

module.exports = mongoose.model('Item', ItemSchema);