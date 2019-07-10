const FriendController              = require('./controllers/friend')
  , AuthController                  = require('./controllers/auth')
  , express                         = require('express')
  , authHelper                      = require('./helpers/auth');

module.exports = function (app) {

  const apiRoutes                   = express.Router()
    , authRoutes                    = express.Router()
    , userRoutes                    = express.Router()
    , friendRoutes                  = express.Router();

  // Default routes
  apiRoutes.get('/', (req, res) => {
    res.send('Im the home page!')
  });

  // Auth routes
  apiRoutes.use('/auth', authRoutes);
  authRoutes.post('/', AuthController.login);

  apiRoutes.use('/users', userRoutes);
  userRoutes.get('/', authHelper.authorize, FriendController.getFriendInfo);

  // Friends routes
  apiRoutes.use('/friends', friendRoutes);
  friendRoutes.get('/', FriendController.getItems);
  friendRoutes.get('/last', FriendController.getLastFriendInRow);

  //Not found route
  apiRoutes.use((req, res) => {
    res.status(404).send("Route not found");
  });

  // Set up routes
  app.use('/api', apiRoutes);

}