const IndicatorRecordController     = require('./controllers/indicatorRecord'),
      IndicatorController           = require('./controllers/indicator'),
      AuthController                = require('./controllers/auth'),
      getIndicatorRequest           = require('./requests/indicatorRequests/getIndicator'),
      getIndicatorRecordsRequest    = require('./requests/indicatorRecordRequests/getIndicatorRecord'),
      getIndicatorDates             = require('./requests/indicatorRecordRequests/getIndicatorDates'),
      postIndicatorRecordsRequest   = require('./requests/indicatorRecordRequests/postIndicatorRecord'),
      express                       = require('express'),
      tokenValidator                = require('./tokenValidator');
module.exports = function(app) {

    const apiRoutes               = express.Router(),
          indicatorRoutes         = express.Router(),
          indicatorRecordsRoutes  = express.Router(),
          authRoutes              = express.Router();

    // Default routes
    apiRoutes.get('/', (req, res) => {
        res.send('Im the home page!')
    });

    // Indicator routes
    apiRoutes.use('/indicators', indicatorRoutes);
    indicatorRoutes.get('/',tokenValidator.required, IndicatorController.getIndicators);
    indicatorRoutes.get('/:_id', IndicatorController.getIndicatorByIdentifier);
    indicatorRoutes.post('/', getIndicatorRequest, IndicatorController.createIndicator);
    indicatorRoutes.put('/:_id', getIndicatorRequest, IndicatorController.updateIndicator);
    indicatorRoutes.delete('/:_id', IndicatorController.deleteIndicator);

    // Indicator Record Routes
    apiRoutes.use('/records', indicatorRecordsRoutes);
    indicatorRecordsRoutes.get('/:indicatorId', getIndicatorRecordsRequest, IndicatorRecordController.get);
    indicatorRecordsRoutes.get('/:indicatorId/dates', getIndicatorDates, IndicatorRecordController.getDates);
    indicatorRecordsRoutes.post('/:indicatorId', postIndicatorRecordsRequest, IndicatorRecordController.createRecord);
    indicatorRecordsRoutes.put('/:indicatorId/:_id', postIndicatorRecordsRequest, IndicatorRecordController.updateRecord);
    indicatorRecordsRoutes.delete('/:indicatorId/:_id', IndicatorRecordController.deleteRecord);

    // User Routes
    apiRoutes.use('/auth', authRoutes)
    authRoutes.post('/', AuthController.register);
    authRoutes.post('/login', AuthController.login);
    authRoutes.get('/logout', AuthController.logout);


    //Not found route
    apiRoutes.use( (req, res, next) => {
        res.status(404).send("Not found");
    });

    // Set up routes
    app.use('/api', apiRoutes);

}