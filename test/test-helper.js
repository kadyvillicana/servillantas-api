const mongoose = require('mongoose');

// Connect to db before running the tests
before((done) => {
  mongoose.connect("mongodb://127.0.0.1:27017/lgt_testing", { useNewUrlParser: true });
  mongoose.connection
    .once('open', () => { })
    .on('error', (error) => {
      /* eslint-disable no-console */
      console.warn('Error : ', error);
      /* eslint-enable no-console */
    });

  done();
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

// Disconnect from db after all tests have run
after((done) => {
  mongoose.disconnect();
  done();
});