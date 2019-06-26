const { body } = require('express-validator/check');

module.exports = [
  body('records.*.date')
    .exists().withMessage('date is required')
    .isISO8601().withMessage('date must be a valid date'),
  
  body('records.*.amount')
    .exists().withMessage('amount is required')
    .isNumeric().withMessage('amount must be a valid number'),

  body('records.*.place')
    .exists().withMessage('place is required')
    .isString().withMessage('place must be a string'),
]