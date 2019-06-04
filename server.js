require('dotenv').config();
const express           = require('express');
const app               = express();
const mongoose          = require('mongoose');
const logger            = require('morgan');
const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const session           = require('express-session');
const MongoStore        = require('connect-mongo')(session);
const cors              = require('cors');
const databaseConfig    = require('./config/database');
const router            = require('./routes');
const passport          = require('passport');
require('./config/passport');

mongoose.set('useCreateIndex', true);
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
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(cors());

// Express Session
app.use(session({
  secret: process.env.SESSION,
  saveUninitialized: true,
  resave: true,
  store: new MongoStore({ mongooseConnection: connection })
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

router(app);