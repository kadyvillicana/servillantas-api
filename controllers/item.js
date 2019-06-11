const Item                 = require('../models/item');
const { validationResult } = require('express-validator/check');
const _async               = require('async');
const DUPLICATE_NAME       = require('../constants/errors').DUPLICATE_NAME;
const uploadImage          = require('../services/uploadImage');
const isBase64             = require('is-base64');

/**
 * Function to get all the items available.
 * 
 * @returns {Array} Model Item
 */
exports.getItems = (req, res, next) => {
  Item.find({ deleted: false }, ['_id', 'name', 'shortName', 'hasIndicators'], { sort: { position: 1 } }, (err, items) => {
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
exports.addItem = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, shortName, hasIndicators } = req.body;
  let itemObject = { name, shortName, hasIndicators };

  // If this item has no indicators
  // add the title, content, coverImage and sliderImages
  if (!hasIndicators) {
    const { title, content, cover, images } = req.body;

    // missing image logic

    itemObject = {
      ...itemObject,
      title,
      content,
      cover,
      images,
    }
  }

  Item.create(itemObject, async (err, item) => {
    if (err) {

      // If this item is duplicated, return the error
      if (err.errors && err.errors.name) {
        return res.status(409).json({ error: DUPLICATE_NAME });
      }

      return next(err);
    }

    try {
      if (itemObject.cover && isBase64(itemObject.cover, { mime: true })) {
        const coverUrl = await uploadImage(itemObject.cover);
        item.coverImage = coverUrl;

        await item.save();
      }
    } catch (err) {
      return res.status(200).send({ data: item, success: false, message: 'Error saving images' });
    }

    res.status(200).send({ data: item, success: true });
  });
}

/**
 * Function to edit an item.
 * 
 * @returns {Object} Model Item
 */
exports.editItem = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, shortName, hasIndicators } = req.body;
  let itemObject = { name, shortName, hasIndicators };

  // If this item has no indicators
  // add the title, content, coverImage and sliderImages
  if (!hasIndicators) {
    const { title, content, cover, images } = req.body;

    // missing image logic

    itemObject = {
      ...itemObject,
      title,
      content,
      cover,
      images,
    }
  }

  Item.findOne({ _id: req.params.id }, async (err, item) => {
    if (err) {
      return next(err);
    }

    item.name = itemObject.name;
    item.shortName = itemObject.shortName;
    item.hasIndicators = itemObject.hasIndicators;

    // Flag to know if there are images
    let pendingImagesToSave = false;
    if (!itemObject.hasIndicators) {
      item.title = itemObject.title;
      item.content = itemObject.content;

      if (itemObject.cover || itemObject.images) {
        pendingImagesToSave = true;
      }
    }

    // Before saving the images, validate that the
    // name is not already taken
    try {
      await item.save();
    } catch (err) {
      if (err.errors && err.errors.name) {
        return res.status(409).json({ error: DUPLICATE_NAME });
      }
      return next(err);
    }

    if (pendingImagesToSave) {

      // Save the images in the bucket
      try {
        let createdImages = false;
        if (itemObject.cover && isBase64(itemObject.cover, { mime: true })) {
          const coverUrl = await uploadImage(itemObject.cover);
  
          // set image 
          item.coverImage = coverUrl;
          createdImages = true;
        }

        // If images were created
        if (createdImages) {
          await item.save();
        }
      } catch (err) {
        return res.status(200).send({ data: item, success: false, message: 'Error saving images' });
      }
    }

    res.status(200).send({ data: item, success: true });
  });
}

/**
 * Function to update the position of the items.
 * 
 * @returns {Object} Success status or error.
 */
exports.reorderItems = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { items } = req.body;

  // Update each item, one by one
  _async.eachSeries(items, (item, done) => {
    Item.updateOne({ _id: item._id }, { $set: { position: item.position } }, done);
  }, (err) => { // This function is called when all items are updated or when there is an error
    if (err) {
      return next(err);
    }

    return res.status(200).send({ success: true });
  });

}

/**
 * Function to change the deleted status of an item.
 * 
 * @returns {Object} Item model.
 */
exports.deleteItem = (req, res, next) => {
  const { id } = req.params;

  Item.findOneAndUpdate({ _id: id }, { $set: { deleted: true } }, (err, item) => {
    if (err) {
      return next(err);
    }

    return res.status(200).send({ data: item, success: true });
  });
}