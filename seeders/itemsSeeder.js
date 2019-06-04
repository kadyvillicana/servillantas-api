const Item                  = require('../models/item');
const mongoose              = require('mongoose');
const items                 = require('../helpers/items-array')();
const databaseConfig        = require('../config/database');

mongoose.connect(databaseConfig().url, databaseConfig().options);

// Add items
Item.deleteMany({}, (err) => {
  if (err) {
    disconnect();
    return;
  }

  Item.insertMany(items, () => disconnect());
});

const disconnect = () => mongoose.disconnect();