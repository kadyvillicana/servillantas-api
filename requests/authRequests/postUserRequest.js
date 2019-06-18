const { body } = require('express-validator/check');

module.exports = [
  body('email').not().isEmpty().withMessage('Email must not be empty'),
]