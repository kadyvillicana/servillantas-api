const IndicatorRecordController     = require('./controllers/indicatorRecord'),
    getIndicatorRequest             = require('./requests/indicatorRequests/getIndicator');
    getIndicatorRecordsRequest      = require('./requests/indicatorRecordRequests/getIndicatorRecord'),
    express                         = require('express');
const indicatorController = require('./controllers/indicator');

module.exports = function(app) {

    const apiRoutes               = express.Router(),
        indicatorRoutes           = express.Router(),
        indicatorRecordsRoutes    = express.Router();

    // Default routes
    apiRoutes.get('/', (req, res) => {
        res.send('Im the home page!')
    });

    // Indicator routes
    apiRoutes.use('/indicators', indicatorRoutes);
    indicatorRoutes.get('/', indicatorController.getIndicators);
    indicatorRoutes.get('/:_id', indicatorController.getIndicatorByIdentifier);
    indicatorRoutes.post('/', getIndicatorRequest(), indicatorController.createIndicator);
    indicatorRoutes.put('/:_id', getIndicatorRequest(), indicatorController.updateIndicator);
    indicatorRoutes.patch('/:_id', indicatorController.updateIndicator);
    indicatorRoutes.delete('/:_id', indicatorController.deleteIndicator);

    // Indicator Record Routes
    apiRoutes.use('/records', indicatorRecordsRoutes);
    indicatorRecordsRoutes.get('/:type', getIndicatorRecordsRequest(), IndicatorRecordController.get);

    //Not found route
    apiRoutes.use( (req, res, next) => {
        res.status(404).send("Not found");
    });

    // Set up routes
    app.use('/api', apiRoutes);

}