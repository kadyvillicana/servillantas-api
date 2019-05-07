var ComplaintController   = require('./controllers/indicators/complaints')
    express               = require('express');

module.exports = function(app) {

    var apiRoutes       = express.Router(),
        indicatorRoutes = express.Router();

    // Default routes
    apiRoutes.get('/', (req, res) => {
        res.send('im the home page!')
    });

    // Indicator rotues
    apiRoutes.use('/indicators', indicatorRoutes);
    indicatorRoutes.get('/', (req, res) => {
        res.send('Indicators')
    })

    // Indicator Routes
    apiRoutes.use('/indicators', indicatorRoutes);
    indicatorRoutes.get('/complaints', ComplaintController.getAllComplaints);

    //Not found route
    apiRoutes.use( (req, res, next) => {
        res.status(404).send("Not found");
    });

    // Set up routes
    app.use('/api', apiRoutes);

}