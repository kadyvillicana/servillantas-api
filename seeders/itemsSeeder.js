const Item                  = require('../models/item');
const mongoose              = require('mongoose');
const items                 = require('../helpers/items-array')();
const databaseConfig        = require('../config/database');

mongoose.connect(databaseConfig().url, databaseConfig().options);

// Add items
Item.deleteMany({}, (err) => {
  if (err) {
    /* eslint-disable no-console */
    console.error(err);
    /* eslint-enable no-console */
    disconnect();
    return;
  }

  Item.insertMany(items, (err) => {
    if (err) {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }

    disconnect()
  });
});

const disconnect = () => mongoose.disconnect();