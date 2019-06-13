const IndicatorRecordController     = require('./controllers/indicatorRecord');
const ItemController                = require('./controllers/item');
const AdminItemController           = require('./controllers/admin/item');
const IndicatorController           = require('./controllers/indicator');
const AuthController                = require('./controllers/auth');
const ShortURLController            = require('./controllers/shortURL');
const addItemRequest                = require('./requests/itemRequests/addItem');
const reorderItemsRequest           = require('./requests/itemRequests/reorderItems');
const getIndicatorRequest           = require('./requests/indicatorRequests/getIndicator');
const getIndicatorRecordsRequest    = require('./requests/indicatorRecordRequests/getIndicatorRecord');
const getIndicatorDates             = require('./requests/indicatorRecordRequests/getIndicatorDates');
const postIndicatorRecordsRequest   = require('./requests/indicatorRecordRequests/postIndicatorRecord');
const postUserRequest               = require('./requests/authRequests/postUserRequest');
const recoverPassRequest            = require('./requests/authRequests/recoverPassRequest');
const express                       = require('express');
const tokenValidator                = require('./tokenValidator');

module.exports = function (app) {

  const apiRoutes                   = express.Router();
  const itemRoutes                  = express.Router();
  const indicatorRoutes             = express.Router({ mergeParams: true });
  const indicatorRecordsRoutes      = express.Router();
  const authRoutes                  = express.Router();
  const shortURLRoutes              = express.Router();
  const adminRoutes                 = express.Router();
  const adminItemRoutes             = express.Router();

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
  adminItemRoutes.post('/', tokenValidator.required, addItemRequest, AdminItemController.addItem);
  adminItemRoutes.put('/reorder', tokenValidator.required, reorderItemsRequest, AdminItemController.reorderItems);
  adminItemRoutes.put('/:id', tokenValidator.required, addItemRequest, AdminItemController.editItem);
  adminItemRoutes.delete('/:id', tokenValidator.required, AdminItemController.deleteItem);

  // Item routes
  apiRoutes.use('/items', itemRoutes);
  itemRoutes.get('/', ItemController.getItems);
  itemRoutes.get('/:id', ItemController.getItem);
  itemRoutes.get('/:itemId/indicators', IndicatorController.getIndicators);

  // Indicator routes
  apiRoutes.use('/indicators', indicatorRoutes);
  indicatorRoutes.get('/:_id', IndicatorController.getIndicatorByIdentifier);
  indicatorRoutes.post('/', tokenValidator.required, getIndicatorRequest, IndicatorController.createIndicator);
  indicatorRoutes.put('/:_id', tokenValidator.required, getIndicatorRequest, IndicatorController.updateIndicator);
  indicatorRoutes.delete('/:_id', tokenValidator.required, IndicatorController.deleteIndicator);

  // Indicator Record Routes
  apiRoutes.use('/records', indicatorRecordsRoutes);
  indicatorRecordsRoutes.get('/:indicatorId', getIndicatorRecordsRequest, IndicatorRecordController.get);
  indicatorRecordsRoutes.get('/:indicatorId/dates', getIndicatorDates, IndicatorRecordController.getDates);
  indicatorRecordsRoutes.post('/:indicatorId', tokenValidator.required, postIndicatorRecordsRequest, IndicatorRecordController.createRecord);
  indicatorRecordsRoutes.put('/:indicatorId/:_id', tokenValidator.required, postIndicatorRecordsRequest, IndicatorRecordController.updateRecord);
  indicatorRecordsRoutes.delete('/:indicatorId/:_id', tokenValidator.required, IndicatorRecordController.deleteRecord);

  // User Routes
  apiRoutes.use('/auth', authRoutes)
  authRoutes.post('/', postUserRequest, AuthController.register);
  authRoutes.post('/login', postUserRequest, AuthController.login);
  authRoutes.get('/logout', AuthController.logout);
  authRoutes.post('/recoverPassword', recoverPassRequest, AuthController.forgotPassword);
  authRoutes.post('/recoverPassword/:token', AuthController.updatePasswordByEmail);

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