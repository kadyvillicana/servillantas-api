const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema(
  {
    mercadolibreId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    attributes: [{
      attribute_group_id: String,
      attribute_group_name: String,
      id: String,
      name: String,
      value_id: String,
      value_name: String
    }],
    pictures: [{
      secure_url: String,
      size: String,
      url: String
    }],
    status: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Cars', CarSchema);
