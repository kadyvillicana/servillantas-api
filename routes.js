var IndicatorRecordController       = require('./controllers/indicatorRecord'),
    getIndicatorRecordsRequest      = require('./requests/getIndicatorRecord'),
    express                         = require('express');

module.exports = function(app) {

    var apiRoutes       = express.Router(),
        indicatorRoutes = express.Router();

    // Default routes
    apiRoutes.get('/', (req, res) => {
        res.send('Im the home page!')
    });

    // Indicator rotues
    apiRoutes.use('/indicators', indicatorRoutes);
    indicatorRoutes.get('/', (req, res) => {
        res.send('Indicators')
    })

    // Indicator Routes
    apiRoutes.use('/indicators', indicatorRoutes);
    indicatorRoutes.get('/:type', getIndicatorRecordsRequest(), IndicatorRecordController.get);

    //Not found route
    apiRoutes.use( (req, res, next) => {
        res.status(404).send("Not found");
    });

    // Set up routes
    app.use('/api', apiRoutes);

}