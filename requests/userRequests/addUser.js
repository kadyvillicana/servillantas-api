const { body } = require('express-validator/check');

module.exports = [
  body('email')
    .not()
    .isEmpty().withMessage('Email must not be empty')
    .isString().withMessage('Email must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Email must have between 1 and 255 characters'),
  
  body('name').not().isEmpty().withMessage('Name must not be empty')
    .isString().withMessage('name must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('name must have between 1 and 255 characters'),

  body('lastName').not().isEmpty().withMessage('lastName must not be empty')
    .isString().withMessage('lastName must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('lastName must have between 1 and  255 characters'),

  body('organization').not().isEmpty().withMessage('Organization must not be empty')
    .isString().withMessage('organization must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('Organization must have between 1 and  255 characters'),

  body('role').not().isEmpty().withMessage('Email must not be empty')
    .isString().withMessage('role must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('role must have between 1 and 255 characters'),

]