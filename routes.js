var express = require('express')
const indicatorController = require('./controllers/indicator');

module.exports = function(app){

    var apiRoutes       = express.Router(),
        indicatorRoutes = express.Router();

    // Default routes
    apiRoutes.get('/', (req, res) => {
        res.send('im the home page!')
    });

    // Indicator routes
    apiRoutes.use('/indicators', indicatorRoutes);
    indicatorRoutes.get('/', indicatorController.getIndicators);
    indicatorRoutes.get('/:_id', indicatorController.getIndicatorByIdentifier);
    indicatorRoutes.post('/', indicatorController.createIndicator);
    indicatorRoutes.put('/:_id', indicatorController.updateIndicator);
    indicatorRoutes.patch('/:_id', indicatorController.updateIndicator);
    indicatorRoutes.delete('/:_id', indicatorController.deleteIndicator);

    //Not found route
    apiRoutes.use( (req, res, next) => {
        res.status(404).send("Not found");
    });

    // Set up routes
    app.use('/api', apiRoutes);

}
