const FriendController              = require('./controllers/friend')
  , express                         = require('express');

module.exports = function (app) {

  const apiRoutes                   = express.Router()
    , friendRoutes                  = express.Router();

  // Default routes
  apiRoutes.get('/', (req, res) => {
    res.send('Im the home page!')
  });

  // Item routes
  apiRoutes.use('/friends', friendRoutes);
  friendRoutes.get('/', FriendController.getItems);
  friendRoutes.get('/last', FriendController.getLastFriendInRow);

  //Not found route
  apiRoutes.use((req, res) => {
    res.status(404).send("Not found");
  });

  // Set up routes
  app.use('/api', apiRoutes);

}