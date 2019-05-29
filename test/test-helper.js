const mongoose = require('mongoose');

// Connect to db before running the tests
before((done) => {
    mongoose.connect("mongodb://127.0.0.1:27017/lgt_testing", { useNewUrlParser: true });
    mongoose.connection
        .once('open', () => {})
        .on('error', (error) => {
            console.warn('Error : ', error);
        });

    done();
});

// Drop collections after each test
beforeEach((done) => {
    for (var collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].drop()
            .catch(() => console.warn('Error dropping collection. It may not exist.'));
    }

    done();
});

// Disconnect from db after all tests have run
after((done) => {
    mongoose.disconnect();
    done();
});