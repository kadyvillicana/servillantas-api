const Item                 = require('../../models/item');
const Indicator            = require('../../models/indicator');
const ItemImage            = require('../../models/itemImage');
const { validationResult } = require('express-validator/check');
const _async               = require('async');
const ERRORS               = require('../../constants/errors');
const uploadImage          = require('../../services/uploadImage');
const isBase64             = require('is-base64');
const strToObjectId        = require('../../helpers/stringToObjectId');
const ObjectId             = require('mongoose').Types.ObjectId;

/**
 * Return object with stages common to getItems
 * and getItem.
 */
const getCommonProjectStage = () => {
  return {
    _id: 1,
    number: 1,
    name: 1,
    shortName: 1,
    position: 1,
    description: 1,
    hasIndicators: 1,
    user: {
      $let: {
        vars: {
          u: {
            $arrayElemAt: ['$updatedByUser', 0]
          }
        },
        in: {
          _id: '$$u._id',
          name: '$$u.name',
          lastName: '$$u.lastName'
        }
      },
    },
    updatedAt: 1,
    indicators: {
      $reduce: {
        input: '$indicators',
        initialValue: [],
        in: '$indicators._id'
      }
    }
  }
}

/**
 * Return object to populate the indicators field.
 */
const indicatorsLookup = () => {
  return {
    $lookup: {
      from: "indicators",
      localField: "_id",
      foreignField: "itemId",
      as: "indicators"
    }
  }
}

/**
 * Return object to populate the
 * users field.
 */
const userLookup = () => {
  return {
    $lookup: {
      from: "users",
      localField: "updatedBy",
      foreignField: "_id",
      as: "updatedByUser"
    }
  }
}

/**
 * Function to get all the items available.
 * 
 * @returns {Array} Model Item
 */
exports.getItems = (req, res, next) => {

  Item.aggregate([
    {
      $match: {
        deleted: false
      }
    },
    {
      ...indicatorsLookup()
    },
    {
      ...userLookup(),
    },
    {
      $project: {
        ...getCommonProjectStage()
      }
    },
    {
      $sort: {
        position: 1
      }
    }
  ]).exec((err, results) => {
    if (err) {
      return next(err);
    }

    if (!results.length) {
      return res.status(200).send({ message: "There are no items", success: false });
    }

    return res.status(200).send({ data: results, success: true });
  });
}

/**
 * Function to get the info of the item
 * with the given id.
 * 
 * @returns {object} Model Item
 */
exports.getItem = (req, res, next) => {
  const { id } = req.params;

  Item.aggregate([
    {
      $match: {
        _id: ObjectId(id),
        deleted: false
      }
    },
    {
      ...indicatorsLookup()
    },
    {
      ...userLookup()
    },
    {
      $project: {
        ...getCommonProjectStage(),
        coverImage: 1,
        title: 1,
        content: 1,
        sliderImages: 1,
      }
    },
    {
      $sort: {
        position: 1
      }
    }
  ]).exec(async (err, item) => {
    if (err) {
      return next(err);
    }

    if (!item.length) {
      return res.status(404).send({ error: "Item not found"});
    }

    // If this item has no indicators, populate the image properties
    if (!item[0].hasIndicators) {
      Item
        .populate(item, { path: 'coverImage sliderImages', select: '_id url' }, (err, _item) => {
          if (err) {
            return next(err);
          }
  
          return res.status(200).send({ data: _item[0], success: true });
        });
    } else {
      return res.status(200).send({ data: item[0], success: true });
    }
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

  const { name, shortName, hasIndicators, description } = req.body;
  let itemObject = {
    name: name.trim(),
    shortName: shortName.trim(),
    hasIndicators,
    description: description && description.trim(),
    updatedBy: req.user.id,
  };

  // If this item has no indicators
  // add the title, content, coverImage and sliderImages
  if (!hasIndicators) {
    const { title, content } = req.body;

    itemObject = {
      ...itemObject,
      title: title.trim(),
      content: content.trim(),
    }
  }

  // First save the item without the images
  Item.create(itemObject, async (err, item) => {
    if (err) {
      let errors = [];
      // If this item's name is duplicated, return the error
      if (err.errors && err.errors.name) {
        errors.push({ name: ERRORS.DUPLICATE_NAME })
      }

      // If this item's shortName is duplicated, return the error
      if (err.errors && err.errors.shortName) {
        errors.push({ shortName: ERRORS.DUPLICATE_SHORTNAME })
      }
      
      if (errors.length) {
        return res.status(409).json({ errors });
      }

      return next(err);
    }

    if (!hasIndicators) {
      try {
        const { cover, images } = req.body;
        let addedImages = false;
  
        // If a cover is set, upload, crete record and save the reference in the item
        if (cover &&  isBase64(cover.data, { mime: true })) {
          const coverImage = await uploadImageAndCreateRecord(item._id, cover.data, 'cover');
          item.coverImage = coverImage;
          addedImages = true;
        }
  
        // If an array of images is set, upload them, create the records and save the reference in the item
        if (images) {
          const imagePromises = [];
          for (let i = 0; i < images.length; i++) {
            if (images[i].data) {
              imagePromises.push(uploadImageAndCreateRecord(item._id, images[i].data, 'slider'));
            }
          }
  
          if (imagePromises.length) {
            const sliderImages = await Promise.all(imagePromises);
            item.sliderImages = sliderImages;
            addedImages = true;
          }
        }
  
        // If images were added to the item, save again
        if (addedImages) {
          await item.save();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.status(200).send({ data: await item.toJsonResponse(), success: false, message: 'Error saving images', error: err });
      }
    }

    res.status(200).send({ data: await item.toJsonResponse(), success: true });
  });
}

/**
 * Function to upload image to aws
 * and insert the record in the collection.
 * 
 * @param {object} id ObjectId of the item
 * @param {string} data base64
 * @param {string} type cover or slider
 */
const uploadImageAndCreateRecord = async (id, data, type) => {

  const url = await uploadImage(data);
  const itemImage = await ItemImage.create({ itemId: id, type, url });

  return Promise.resolve(itemImage);
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

  const { name, shortName, hasIndicators, description } = req.body;
  let itemObject = {
    name: name.trim(),
    shortName: shortName.trim(),
    hasIndicators,
    description: description ? description.trim() : '',
    updatedBy: req.user.id,
  };

  // If this item has no indicators add the title and content
  if (!hasIndicators) {
    const { title, content } = req.body;

    itemObject = {
      ...itemObject,
      title: title.trim(),
      content: content.trim()
    }
  }

  // Get the item to edit
  Item.findOne({ _id: req.params.id, deleted: false }, async (err, item) => {
    if (err) {
      return next(err);
    }

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const currentlyHasIndicators = item.hasIndicators;

    item.name = itemObject.name;
    item.shortName = itemObject.shortName;
    item.description = itemObject.description;
    item.hasIndicators = itemObject.hasIndicators;
    item.updatedBy = itemObject.updatedBy,
    // Clear the title and content
    item.title = undefined;
    item.content = undefined;

    if (!itemObject.hasIndicators) {
      item.title = itemObject.title;
      item.content = itemObject.content;
    }

    // Before saving the images, validate that the name is not already taken
    try {
      await item.save();
    } catch (err) {
      let errors = [];
      // If this item's name is duplicated, return the error
      if (err.errors && err.errors.name) {
        errors.push({ name: ERRORS.DUPLICATE_NAME })
      }

      // If this item's shortName is duplicated, return the error
      if (err.errors && err.errors.shortName) {
        errors.push({ shortName: ERRORS.DUPLICATE_SHORTNAME })
      }
      
      if (errors.length) {
        return res.status(409).json({ errors });
      }
      return next(err);
    }

    // If the item used to have indicators and is updated to not have anymore
    // update the reference of those indicators
    if (!itemObject.hasIndicators && currentlyHasIndicators) {
      try {
        await Indicator.updateMany({ itemId: item._id }, {$set: { itemId: undefined }});
      } catch (err) {
        return res.status(500).json({ error: 'Error updating indicators' });
      }
    }

    if (!itemObject.hasIndicators) {

      // Save the images in the bucket
      try {
        const { cover, images, coverRemoved } = req.body;

        let idsToSave = [];
        let shouldSaveAgain = false;
        let currentImages = item.cover ? 1 : 0;
        currentImages += item.sliderImages ? item.sliderImages.length : 0;
        if (cover) {
          // If the image is already stored, check that it wasn't removed
          if (cover._id && cover.url && !coverRemoved) {
            idsToSave.push(strToObjectId(cover._id));
          } else if (coverRemoved) { // If it was removed, the item should be saved again
            item.coverImage = undefined;
            shouldSaveAgain = true;
          }

          // If a new cover picture was selected, save it
          if (isBase64(cover.data, { mime: true })) {
            const coverImage = await uploadImageAndCreateRecord(item, cover.data, 'cover');
            // Indicate this id should not be deleted
            idsToSave.push(strToObjectId(coverImage._id));
            item.coverImage = coverImage;
            shouldSaveAgain = true;
          }
        }

        if (images) {
          const imagePromises = [];
          const newImages = [];
          for (let i = 0; i < images.length; i++) {
            // If the image is already stored, check that it wasn't removed
            if (images[i]._id && images[i].url && !images[i].removed) {
              newImages.push(images[i]._id);
              idsToSave.push(strToObjectId(images[i]._id));
            } else if (images[i].data) { // If there is data to add a new image
              imagePromises.push(uploadImageAndCreateRecord(item._id, images[i].data, 'slider'));
              shouldSaveAgain = true;
            }
          }

          // If there are images to add
          let sliderImages = [];
          if (imagePromises.length) {
            sliderImages = await Promise.all(imagePromises);
          }

          const sliderImagesIds = sliderImages.map(s => s._id);
          idsToSave = [...idsToSave, ...sliderImagesIds];
          item.sliderImages = [...newImages, ...sliderImagesIds];
        }

        // If images were added or removed, save again and delete
        // the ones that won't be used anymore
        if (shouldSaveAgain || idsToSave.length !== currentImages) {
          await item.save();
          await ItemImage.updateMany(
            {
              itemId: item._id,
              _id: { $nin: idsToSave }
            },
            { $set: { deleted: true } }
          );
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        return res.status(200).send({ data: await item.toJsonResponse(), success: false, message: 'Error saving images', error: err });
      }
    }

    res.status(200).send({ data: await item.toJsonResponse(), success: true });
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
  const { params: { id }, user } = req;

  Item.findOneAndUpdate({ _id: id, deleted: false }, { $set: { deleted: true, updatedBy: user.id } }, (err, item) => {
    if (err) {
      return next(err);
    }

    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }

    Indicator.updateMany({ itemId: item._id }, {$set: { itemId: undefined }}, (err) => {
      if (err) {
        return res.status(200).send({ data: item, success: false, message: "Error updating indicators" });
      }
    });

    return res.status(200).send({ data: item, success: true });
  });
}