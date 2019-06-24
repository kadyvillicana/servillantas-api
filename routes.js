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
const tokenValidator                = require('./tokenValidator');
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
  adminItemRoutes.get('/', tokenValidator.required, AdminItemController.getItems);
  adminItemRoutes.get('/:id', tokenValidator.required, AdminItemController.getItem);
  adminItemRoutes.post('/', authenticated.authorize, addItemRequest, AdminItemController.addItem);
  adminItemRoutes.put('/reorder', tokenValidator.required, reorderItemsRequest, AdminItemController.reorderItems);
  adminItemRoutes.put('/:id', authenticated.authorize, addItemRequest, AdminItemController.editItem);
  adminItemRoutes.delete('/:id', tokenValidator.required, AdminItemController.deleteItem);

  // Admin Indicator routes
  adminRoutes.use('/indicators', adminIndicatorRoutes);
  adminIndicatorRoutes.get('/', tokenValidator.required, AdminIndicatorController.getIndicators);
  adminIndicatorRoutes.get('/:id', tokenValidator.required, AdminIndicatorController.getIndicator);
  adminIndicatorRoutes.post('/', tokenValidator.required, getIndicatorRequest, AdminIndicatorController.createIndicator);
  adminIndicatorRoutes.put('/:_id', tokenValidator.required, getIndicatorRequest, AdminIndicatorController.updateIndicator);
  adminIndicatorRoutes.delete('/:_id', tokenValidator.required, AdminIndicatorController.deleteIndicator);

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
  adminUserRoutes.post('/', tokenValidator.required, addUserRequest, UserController.registerUser)
  adminUserRoutes.get('/', authenticated.authorize, UserController.getUsers)
  adminUserRoutes.get('/:_id', tokenValidator.required, UserController.getUser)
  adminUserRoutes.put('/:_id', tokenValidator.required, addUserRequest, UserController.updateUser);
  adminUserRoutes.delete('/:_id', tokenValidator.required, UserController.deleteUser);
  
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