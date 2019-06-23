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

  body('definition')
    .optional()
    .isString().withMessage('definition must be a string')
    .isLength({ max: 1024 }).withMessage('definition must not be longer than 1024 characters'),

  body('formula')
    .optional()
    .isString().withMessage('formula must be a string')
    .isLength({ max: 1024 }).withMessage('formula must not be longer than 1024 characters'),

  body('numerator')
    .optional()
    .isString().withMessage('numerator must be a string')
    .isLength({ max: 255 }).withMessage('numerator must not be longer than 1024 characters'),

  body('denominator')
    .optional()
    .isString().withMessage('denominator must be a string')
    .isLength({ max: 255 }).withMessage('denominator must not be longer than 1024 characters'),

  
]