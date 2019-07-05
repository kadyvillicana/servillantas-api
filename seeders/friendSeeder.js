const Friend = require('../models/friend');
const mongoose = require('mongoose');
const users = require('../constants/friends')
const databaseConfig = require('../config/database');

mongoose.connect(databaseConfig().url, databaseConfig().options);

const seed = async () => {
  try {
    // drop indexes first so in case collation is changed
    // there won't be an error
    await Friend.collection.dropIndexes();
    await Friend.deleteMany({});

    const promises = [];
    for (let i = 0; i < users.length; i++) {
      promises.push(asyncMethod(users[i]));
    }
    await Promise.all(promises);

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  disconnect();
}

const asyncMethod = async (user) => {
  await Friend.create(user);
  return Promise.resolve();
}

const disconnect = () => mongoose.disconnect();

// Start the seeder
seed();