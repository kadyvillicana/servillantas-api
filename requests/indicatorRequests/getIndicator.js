const { body } = require('express-validator/check');

module.exports = () => {
  return [
    body('item', 'item is required').exists(),
    body('indicatorName', 'Indicator Name is required').exists()
  ]
}