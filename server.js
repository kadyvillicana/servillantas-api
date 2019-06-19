require('dotenv').config();
const express           = require('express');
const app               = express();
const mongoose          = require('mongoose');
const logger            = require('morgan');
const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const cors              = require('cors');
const databaseConfig    = require('./config/database');
const router            = require('./routes');
const passport          = require('passport');
require('./config/passport');

mongoose.set('useFindAndModify', false);
mongoose.connect(databaseConfig().url, databaseConfig().options);
const connection = mongoose.connection;

connection.on('error',
  /* eslint-disable no-console */
  console.error.bind(console, 'connection error:'));
connection.once('open', function () {
  console.log("Connected correctly to db");
  /* eslint-enable no-console */
});

app.listen(process.env.PORT);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' })); // Limit for requests are 50 MB
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());

// Passport init
app.use(passport.initialize());
app.use(passport.session());

router(app);