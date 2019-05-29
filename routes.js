const IndicatorRecordController     = require('./controllers/indicatorRecord'),
      ItemController                = require('./controllers/item'),
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
          itemRoutes              = express.Router(),
          indicatorRoutes         = express.Router({ mergeParams: true }),
          indicatorRecordsRoutes  = express.Router();
          authRoutes              = express.Router();

    // Default routes
    apiRoutes.get('/', (req, res) => {
        res.send('Im the home page!')
    });

    // Item routes
    apiRoutes.use('/items', itemRoutes);
    itemRoutes.get('/', ItemController.getItems);
    itemRoutes.get('/:id', ItemController.getItem);
    itemRoutes.get('/:itemId/indicators', IndicatorController.getIndicators);
    
    // Indicator routes
    apiRoutes.use('/indicators', indicatorRoutes);
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
    authRoutes.post('/recoverPassword', AuthController.forgotPassword);
    authRoutes.post('/recoverPassword/:token', AuthController.updatePasswordByEmail);
  



    //Not found route
    apiRoutes.use( (req, res, next) => {
        res.status(404).send("Not found");
    });

    // Set up routes
    app.use('/api', apiRoutes);

}