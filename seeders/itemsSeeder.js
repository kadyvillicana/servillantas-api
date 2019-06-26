const Item                  = require('../models/item');
const ItemImage             = require('../models/itemImage');
const mongoose              = require('mongoose');
const items                 = require('../helpers/items-array')();
const imagesArray           = require('../helpers/images-array');
const databaseConfig        = require('../config/database');

mongoose.connect(databaseConfig().url, databaseConfig().options);


// Add items
const seed = async () => {
  try {
    // drop indexes first so in case collation is changed
    // there won't be an error
    await Item.collection.dropIndexes();

    // delete items
    await Item.deleteMany({});
    await ItemImage.deleteMany({});

    // wait for each item to be added so the position and number
    // can be set properly
    for (let i = 0; i < items.length; i++) {
      await addItem(items[i], i);
    }

  } catch (err) {
    /* eslint-disable no-console */
    console.error(err);
    /* eslint-enable no-console */
  }

  disconnect();
}

const addItem = async (item, index) => {
  const _item = await Item.create(item);

  if (index === 5) {
    const images = imagesArray(_item._id);
    const _images = await ItemImage.insertMany(images);
    _item.coverImage = _images.find(i => i.type === 'cover');
    _item.sliderImages = _images.filter(i => i.type === 'slider');
    await _item.save();
  }
}

const disconnect = () => mongoose.disconnect();

// Start seeding
seed();