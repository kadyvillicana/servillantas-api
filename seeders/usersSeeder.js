const User = require('../models/user');
const mongoose = require('mongoose');
const users = require('./../constants/users')
const databaseConfig = require('../config/database');

mongoose.connect(databaseConfig().url, databaseConfig().options);

User.deleteMany({}, async (err) => {
  if (err) {
    /* eslint-disable no-console */
    console.error(err);
    /* eslint-enable no-console */
    disconnect();
    return;
  }

  const promises = [];
  try {
    for (let i = 0; i < users.length; i++) {
      promises.push(asyncMethod(users[i]));
    }
    await Promise.all(promises);
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e);
    /* eslint-enable no-console */
  }
  disconnect();
});

const asyncMethod = async (user) => {
  await User.create(user);
  return Promise.resolve();
}

const disconnect = () => mongoose.disconnect();