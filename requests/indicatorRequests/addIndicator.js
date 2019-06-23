const { body }    = require('express-validator/check');

module.exports = [
  body('itemId')
    .exists().withMessage('itemId is required')
    .isString().withMessage('itemId must be a string'),

  body('name')
    .exists().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .isLength({ max: 255 }).withMessage('name must not be longer than 255 characters'),

  body('shortName')
    .exists().withMessage('shortName is required')
    .isString().withMessage('shortName must be a string')
    .isLength({ max: 64 }).withMessage('shortName must not be longer than 64 characters'),
]