const CarController                 = require('./controllers/car')
  , express                         = require('express');

module.exports = function (app) {

  const apiRoutes                   = express.Router()
    , carRoutes                     = express.Router();

  // Default routes
  apiRoutes.get('/', (req, res) => {
    res.send('Im the home page!')
  });


  // Friends routes
  apiRoutes.use('/cars', carRoutes);
  carRoutes.get('/', CarController.getCars);
  carRoutes.get('/top', CarController.getCarsTop);
  carRoutes.get('/:id', CarController.getCar);

  //Not found route
  apiRoutes.use((req, res) => {
    res.status(404).send("Route not found");
  });

  // Set up routes
  app.use('/', apiRoutes);

}