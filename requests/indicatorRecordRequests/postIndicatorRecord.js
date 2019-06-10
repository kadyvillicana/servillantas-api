const { body } = require('express-validator/check');

module.exports = [
  body('state', 'state is required').exists(),
  body('indicatorId', 'IndicatorId is required').exists(),
  body('amount', 'amount is required' ).exists()
]