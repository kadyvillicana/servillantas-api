const { body }    = require('express-validator/check');

module.exports = [
  body('items').exists().withMessage('items field is required'),
  body('items').isArray().withMessage('items must be an array'),
  body('items.*._id').exists().withMessage('_id field is required'),
  body('items.*._id').isString().withMessage('_id field must be a string'),
  body('items.*.position').exists().withMessage('position field is required'),
  body('items.*.position').isInt({ min: 1 }).withMessage('position field must be a positive integer')
]