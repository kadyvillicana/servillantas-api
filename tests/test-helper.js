const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').default;

let mongoServer;
const options = { useNewUrlParser: true };

before((done) => {
  mongoServer = new MongoMemoryServer();
  mongoServer
    .getConnectionString()
    .then((mongoUri) => {
      return mongoose.connect(mongoUri, options, (err) => {
        if (err) {
          done();
        }
      })
    })
    .then(() => done());
});

// Drop collections after each test
beforeEach((done) => {
  for (var collection in mongoose.connection.collections) {
    mongoose.connection.collections[collection].drop()
    /* eslint-disable no-console */
      .catch(() => console.warn('Error dropping collection. It may not exist.'));
    /* eslint-enable no-console */
  }

  done();
});

after(async (done) => {
  mongoose.disconnect().then(() => mongoServer.stop());
  done();
});