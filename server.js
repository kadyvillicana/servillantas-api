const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    databaseConfig = require('./config/database'),
    router = require('./routes');



mongoose.connect(databaseConfig().url, databaseConfig().options);
const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
    console.log("Connected correctly to db");
});


app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

router(app);