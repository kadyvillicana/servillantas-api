const { body } = require('express-validator/check');

module.exports = [
  body('email').not().isEmpty().withMessage('Email must not be empty')
    .isString().withMessage('email must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('name must have between 1 and 255 characters'),

  body('password').not().isEmpty().withMessage('Password must not be empty')
    .isString().withMessage('password must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('password must have between 1 and 255 characters'),
]