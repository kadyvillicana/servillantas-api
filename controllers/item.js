const Item                 = require('../models/item');
const { validationResult } = require('express-validator/check');

/**
 * Function to get all the items available.
 * 
 * @returns {Array} Model Item
 */
exports.getItems = (req, res, next) => {
  Item.find({}, '_id name shortName hasIndicators', (err, items) => {
    if (err) {
      return next(err);
    }

    if (!items.length) {
      return res.status(200).send({ message: "There are no items", success: false });
    }

    return res.status(200).send({ data: items, success: true });
  })
}

/**
 * Function to get the info of the item
 * with the given id.
 * 
 * @returns {object} Model Item
 */
exports.getItem = (req, res, next) => {
  const { id } = req.params;

  Item.findOne({ _id: id }, (err, item) => {
    if (err) {
      return next(err);
    }

    if (!item) {
      return res.status(404).send({ message: "Item not found"});
    }

    return res.status(200).send({ data: item, success: true });
  });
}

/**
 * Function to add a new item.
 * 
 * @returns {Object} Model Item
 */
exports.addItem = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  return res.status(200).send({ message: 'all good' });
}