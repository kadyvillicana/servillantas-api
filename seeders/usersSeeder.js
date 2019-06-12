const User = require('../models/user');
const mongoose = require('mongoose');
const users = require('./../constants/users')
const databaseConfig = require('../config/database');

mongoose.connect(databaseConfig().url, databaseConfig().options);

User.deleteMany({}, err => {
  if (err) {
    /* eslint-disable no-console */
    console.error(err);
    /* eslint-enable no-console */
    disconnect();
    return;
  }

  User.insertMany(users, (err) => {
    if (err) {
    /* eslint-disable no-console */
      console.error(err);
    /* eslint-enable no-console */
    }

    disconnect()
  });
});

const disconnect = () => mongoose.disconnect();