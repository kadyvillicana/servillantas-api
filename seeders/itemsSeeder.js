const Item                  = require('../models/item'),
      mongoose              = require('mongoose'),
      items                 = require('../helpers/items-array')(),
      databaseConfig        = require('../config/database');

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