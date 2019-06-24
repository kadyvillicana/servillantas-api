const IndicatorRecordController     = require('./controllers/indicatorRecord');
const ItemController                = require('./controllers/item');
const AdminItemController           = require('./controllers/admin/item');
const AdminIndicatorController      = require('./controllers/admin/indicator');
const IndicatorController           = require('./controllers/indicator');
const AuthController                = require('./controllers/auth');
const UserController                = require('./controllers/user')
const ShortURLController            = require('./controllers/shortURL');
const addItemRequest                = require('./requests/itemRequests/addItem');
const reorderItemsRequest           = require('./requests/itemRequests/reorderItems');
const getIndicatorRequest           = require('./requests/indicatorRequests/getIndicator');
const getIndicatorRecordsRequest    = require('./requests/indicatorRecordRequests/getIndicatorRecord');
const getIndicatorDates             = require('./requests/indicatorRecordRequests/getIndicatorDates');
const postUserRequest               = require('./requests/authRequests/postUserRequest');
const addUserRequest                = require('./requests/userRequests/addUser')
const recoverPassRequest            = require('./requests/authRequests/recoverPassRequest');
const express                       = require('express');
const authenticated                 = require('./isAuth');

module.exports = function (app) {

  const apiRoutes                   = express.Router();
  const itemRoutes                  = express.Router();
  const indicatorRoutes             = express.Router({ mergeParams: true });
  const indicatorRecordsRoutes      = express.Router();
  const authRoutes                  = express.Router();
  const shortURLRoutes              = express.Router();
  const adminRoutes                 = express.Router();
  const adminItemRoutes             = express.Router();
  const adminIndicatorRoutes        = express.Router();
  const adminUserRoutes             = express.Router();

  // Default routes
  apiRoutes.get('/', (req, res) => {
    res.send('Im the home page!')
  });

  // Admin routes
  apiRoutes.use('/admin', adminRoutes);
  
  // Admin Item routes
  adminRoutes.use('/items', adminItemRoutes);
  adminItemRoutes.get('/', authenticated.autorize, AdminItemController.getItems);
  adminItemRoutes.get('/:id', authenticated.autorize, AdminItemController.getItem);
  adminItemRoutes.post('/', authenticated.authorize, addItemRequest, AdminItemController.addItem);
  adminItemRoutes.put('/reorder', authenticated.autorize, reorderItemsRequest, AdminItemController.reorderItems);
  adminItemRoutes.put('/:id', authenticated.authorize, addItemRequest, AdminItemController.editItem);
  adminItemRoutes.delete('/:id', authenticated.autorize, AdminItemController.deleteItem);

  // Admin Indicator routes
  adminRoutes.use('/indicators', adminIndicatorRoutes);
  adminIndicatorRoutes.get('/', authenticated.autorize, AdminIndicatorController.getIndicators);
  adminIndicatorRoutes.get('/:id', authenticated.autorize, AdminIndicatorController.getIndicator);
  adminIndicatorRoutes.post('/', authenticated.autorize, getIndicatorRequest, AdminIndicatorController.createIndicator);
  adminIndicatorRoutes.put('/:_id', authenticated.autorize, getIndicatorRequest, AdminIndicatorController.updateIndicator);
  adminIndicatorRoutes.delete('/:_id', authenticated.autorize, AdminIndicatorController.deleteIndicator);

  // Item routes
  apiRoutes.use('/items', itemRoutes);
  itemRoutes.get('/', ItemController.getItems);
  itemRoutes.get('/:id', ItemController.getItem);
  itemRoutes.get('/:itemId/indicators', IndicatorController.getIndicators);

  // Indicator routes
  apiRoutes.use('/indicators', indicatorRoutes);
  indicatorRoutes.get('/:_id', IndicatorController.getIndicatorByIdentifier);

  // Indicator Record Routes
  apiRoutes.use('/records', indicatorRecordsRoutes);
  indicatorRecordsRoutes.get('/:indicatorId', getIndicatorRecordsRequest, IndicatorRecordController.get);
  indicatorRecordsRoutes.get('/:indicatorId/dates', getIndicatorDates, IndicatorRecordController.getDates);

  // Auth Routes
  apiRoutes.use('/auth', authRoutes)
  authRoutes.post('/login', postUserRequest, AuthController.login);
  authRoutes.get('/logout', AuthController.logout);
  authRoutes.post('/recoverPassword', recoverPassRequest, AuthController.forgotPassword);
  authRoutes.post('/recoverPassword/:token', AuthController.updatePasswordByEmail);

  //User Routes
  adminRoutes.use('/users', adminUserRoutes)
  adminUserRoutes.post('/', authenticated.autorize, addUserRequest, UserController.registerUser)
  adminUserRoutes.get('/', authenticated.authorize, UserController.getUsers)
  adminUserRoutes.get('/:_id', authenticated.autorize, UserController.getUser)
  adminUserRoutes.put('/:_id', authenticated.autorize, addUserRequest, UserController.updateUser);
  adminUserRoutes.delete('/:_id', authenticated.autorize, UserController.deleteUser);
  
  // Shorten URL routes
  apiRoutes.use('/url', shortURLRoutes);
  shortURLRoutes.post('/', ShortURLController.addURL);
  shortURLRoutes.get('/:code', ShortURLController.getURL);

  //Not found route
  apiRoutes.use((req, res) => {
    res.status(404).send("Not found");
  });

  // Set up routes
  app.use('/api', apiRoutes);

}