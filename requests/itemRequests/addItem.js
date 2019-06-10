const { body }    = require('express-validator/check');
const isBase64    = require('is-base64');

module.exports = [
  body('name')
    .exists().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .isLength({ max: 255 }).withMessage('name must not be longer than 255 characters'),
  body('shortName')
    .exists().withMessage('shortName is required')
    .isString().withMessage('shortName must be a string')
    .isLength({ max: 64 }).withMessage('shortName must not be longer than 64 characters'),
  body('hasIndicators')
    .exists().withMessage('hasIndicators is required')
    .isBoolean().withMessage('hasIndicators must be boolean'),
  body('title')
    .custom((value, { req }) => {
      const { hasIndicators } = req.body;
      if (!hasIndicators && !value) {
        throw new Error('title is required');
      }

      if (!body('title').isString()) {
        throw new Error('title must be a string');
      }

      if (!body('title').isLength({ max: 255 })) {
        throw new Error('title must not be longer than 255 characters');
      }

      return true;
    }),
  body('content')
    .custom((value, { req }) => {
      const { hasIndicators } = req.body;
      if (!hasIndicators && !value) {
        throw new Error('content is required');
      }

      if (!body('content').isString()) {
        throw new Error('content must be a string');
      }

      if (!body('content').isLength({ max: 10000 })) {
        throw new Error('content must not be longer than 10000 characters');
      }

      return true;
    }),
  body('cover')
    .custom((value, { req }) => {
      const { hasIndicators } = req.body;
      if (hasIndicators || !value) {
        return true;
      }

      if (!isBase64(value, { mime: true })) {
        throw new Error('cover must be valid base64');
      }

      return true;
    }),
  body('images')
    .custom((value, { req }) => {
      const { hasIndicators } = req.body;
      if (hasIndicators || !value) {
        return true;
      }

      if (!Array.isArray(value)) {
        throw new Error('images must be an array of valid base64');
      }

      value.forEach(i => {
        if (!isBase64(i, { mime: true })) {
          throw new Error('images must be an array of valid base64');
        }
      })
      return true;
    })
]