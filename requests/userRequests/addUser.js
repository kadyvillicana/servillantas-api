const { body } = require('express-validator/check');

module.exports = [
  body('email').not().isEmpty().withMessage('Email must not be empty'),
  body('name').not().isEmpty().withMessage('Name must not be empty'),
  body('lastName').not().isEmpty().withMessage('Email must not be empty'),
]