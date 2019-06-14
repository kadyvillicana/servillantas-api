const { body } = require('express-validator/check');

module.exports = [
  body('item', 'item is required').exists(),
  body('name', 'Indicator Name is required').exists()
]