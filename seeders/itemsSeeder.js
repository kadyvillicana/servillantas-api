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

    const itemsPromises = [];
    for (let i = 0; i < items.length; i++) {
      itemsPromises.push(addItem(items[i], i));
    }
  
    await Promise.all(itemsPromises);
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
    await ItemImage.deleteMany({});
    const _images = await ItemImage.insertMany(images);
    _item.coverImage = _images.find(i => i.type === 'cover');
    _item.sliderImages = _images.filter(i => i.type === 'slider');
    await _item.save();
  }
}

const disconnect = () => mongoose.disconnect();

// Start seeding
seed();