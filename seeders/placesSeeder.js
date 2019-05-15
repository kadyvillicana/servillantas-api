const Place        = require('../models/place'),
    mongoose       = require('mongoose'),
    databaseConfig = require('../config/database'),
    places         = require('../constants/places-array');

mongoose.connect(databaseConfig().url, databaseConfig().options);

// Insert the places array after deleteMany has finished
Place.deleteMany({}, err => {
  if (err) {
    disconnect();
    return;
  }

  Place.insertMany(places, () => disconnect());
});

const disconnect = () => mongoose.disconnect();