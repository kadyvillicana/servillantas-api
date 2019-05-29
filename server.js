require('dotenv').config();
const express        = require('express'),
      app            = express(),
      mongoose       = require('mongoose'),
      logger         = require('morgan'),
      bodyParser     = require('body-parser'),
      cookieParser   = require('cookie-parser'),
      session        = require('express-session'),
      cors           = require('cors'),
      databaseConfig = require('./config/database'),
      router         = require('./routes'),
      passport       = require('passport');
                       require('./config/passport');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(databaseConfig().url, databaseConfig().options);
const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
    console.log("Connected correctly to db");
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
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

router(app);