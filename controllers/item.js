const Item = require('../models/item');

exports.getItems = (req, res, next) => {
  Item.find((err, items) => {
    if (err) {
      return next(err);
    }

    if (!items.length) {
      return res.status(200).send({ message: "There are no items", success: false });
    }

    return res.status(200).send({ data: items, success: true });
  })
}

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