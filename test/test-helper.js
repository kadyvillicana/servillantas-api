const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/lgt_testing", { useNewUrlParser: true });
mongoose.connection
    .once('open', () => {})
    .on('error', (error) => {
        console.warn('Error : ', error);
    });

// Runs before each test
beforeEach((done) => {

    for (var collection in mongoose.connection.collections) {
        mongoose.connection.collections[collection].drop();
    }

    done();
});

after((done) => {
    mongoose.disconnect();
    done();
})