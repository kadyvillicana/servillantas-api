var express = require('express')


module.exports = function(app){

    var apiRoutes = express.Router()

    // Set up routes
    app.use('/api/v1', apiRoutes);

}
