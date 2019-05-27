const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

ItemSchema.path('name').validate(async (value) => {
  const item = await mongoose.model('Item', ItemSchema).findOne({ name: value });
  return !item;
}, 'Name already exists');

module.exports = mongoose.model('Item', ItemSchema);