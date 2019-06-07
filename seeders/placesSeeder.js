const Place          = require('../models/place');
const mongoose       = require('mongoose');
const databaseConfig = require('../config/database');
const places         = require('../constants/places-array');

mongoose.connect(databaseConfig().url, databaseConfig().options);

// Insert the places array after deleteMany has finished
Place.deleteMany({}, err => {
  if (err) {
    /* eslint-disable no-console */
    console.error(err);
    /* eslint-enable no-console */
    disconnect();
    return;
  }

  Place.insertMany(places, (err) => {
    if (err) {
      /* eslint-disable no-console */
      console.error(err);
      /* eslint-enable no-console */
    }

    disconnect()
  });
});

const disconnect = () => mongoose.disconnect();