const { body }    = require('express-validator/check');

module.exports = [
  body('itemId')
    .optional()
    .isString().withMessage('itemId must be a string'),

  body('name')
    .exists().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('name must not be longer than 255 characters'),

  body('shortName')
    .exists().withMessage('shortName is required')
    .isString().withMessage('shortName must be a string')
    .trim()
    .isLength({ min: 1, max: 64 }).withMessage('shortName must not be longer than 64 characters'),

  body('definition')
    .optional()
    .isString().withMessage('definition must be a string')
    .isLength({ max: 1024 }).withMessage('definition must not be longer than 1024 characters'),

  body('calculationMethod.formula')
    .optional()
    .isString().withMessage('formula must be a string')
    .isLength({ max: 1024 }).withMessage('formula must not be longer than 1024 characters'),

  body('calculationMethod.numerator')
    .optional()
    .isString().withMessage('numerator must be a string')
    .isLength({ max: 255 }).withMessage('numerator must not be longer than 255 characters'),

  body('calculationMethod.denominator')
    .optional()
    .isString().withMessage('denominator must be a string')
    .isLength({ max: 255 }).withMessage('denominator must not be longer than 255 characters'),

  body('frequencies.annual')
    .exists()
    .isBoolean().withMessage('annual must be boolean'),

  body('frequencies.quarterly')
    .exists()
    .isBoolean().withMessage('quarterly must be boolean'),
  body('frequencies.monthly')
    .exists()
    .isBoolean().withMessage('monthly must be boolean'),

  body('geographicBreakdown.federal')
    .exists()
    .isBoolean().withMessage('federal must be boolean'),
  body('geographicBreakdown.state')
    .exists()
    .isBoolean().withMessage('state must be boolean'),
  body('geographicBreakdown.municipal')
    .exists()
    .isBoolean().withMessage('municipal must be boolean'),

  body('problems')
    .optional()
    .isString().withMessage('problems must be a string')
    .trim()
    .isLength({ max: 1024 }).withMessage('problems must not be longer than 1024 characters'),

  body('sources.*')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1024 }).withMessage('source must not be longer than 1024 characters'),

  body('treatment')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1024 }).withMessage('treatment must not be longer than 1024 characters'),
]