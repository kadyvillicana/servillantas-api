const { param, query } = require('express-validator/check');

module.exports = [
  param('indicatorId', 'indicatorId is required').exists(),
  query('year', 'year must be a number greater than 2000').optional().isInt({ gt: 2000 }),
  query('quarter', 'quarter must be a number between 1 and 4').optional().isInt({ min: 1, max: 4 }),
  query('month', 'month must be a number between 0 and 11').optional().isInt({ min: 0, max: 11 }),
  query('breakdown', 'breakdown must be 1 or 0').optional().isIn([0, 1]),
]