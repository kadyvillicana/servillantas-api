require('dotenv').config();
const express           = require('express');
const app               = express();
const mongoose          = require('mongoose');
const logger            = require('morgan');
const bodyParser        = require('body-parser');
const cors              = require('cors');
const databaseConfig    = require('./config/database');
const router            = require('./routes');
// const passport          = require('passport');
// const cron              = require('./services/cron');
// require('./config/passport');

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
app.use(bodyParser.json({ limit: '60mb' })); // Limit for requests are 60 MB
app.use(logger('dev'));
app.use(cors());

router(app);

//Start Cron
// cron.start();