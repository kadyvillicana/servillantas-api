const { body }    = require('express-validator/check');
const isBase64    = require('../../helpers/is-base64');

module.exports = [
  body('name')
    .exists().withMessage('name is required')
    .isString().withMessage('name must be a string')
    .trim()
    .isLength({ min: 1, max: 255 }).withMessage('name must be between 1 and 255 characters'),

  body('shortName')
    .exists().withMessage('shortName is required')
    .isString().withMessage('shortName must be a string')
    .trim()
    .isLength({ min: 1, max: 64 }).withMessage('shortName must be between 1 and 64 characters'),

  body('description')
    .optional()
    .isString().withMessage('description must be a string')
    .trim()
    .isLength({ max: 1024 }).withMessage('description must not be longer than 64 characters'),

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

      if (!body('title').trim().isLength({ min: 1,  max: 255 })) {
        throw new Error('title must be between 1 and 255 characters');
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

      if (!body('content').trim().isLength({ min: 1, max: 10000 })) {
        throw new Error('content must be between 1 and 10000 characters');
      }

      return true;
    }),

  body('cover')
    .custom((value, { req }) => {
      const { hasIndicators } = req.body;
      if (hasIndicators || !value) {
        return true;
      }

      if (typeof value !== 'object') {
        throw new Error('cover must be an object');
      }

      // Validate that data is base64
      if (value.data && !isBase64(value.data)) {
        throw new Error('cover.data must be valid base64');  
      }

      return true;
    }),

  body('coverRemoved')
    .optional()
    .isBoolean().withMessage('coverRemoved must be boolean'),

  body('images')
    .custom((value, { req }) => {
      const { hasIndicators } = req.body;
      if (hasIndicators || !value) {
        return true;
      }

      if (!Array.isArray(value)) {
        throw new Error('images must be an array of valid base64');
      }

      let cont = 0;
      for (let i = 0; i < value.length; i++) {
        const imageObject = value[i];
        validateImageField(imageObject);

        // If there is a new image to add or is already stored
        // and won't be removed, increment cont
        if (imageObject.data || imageObject._id && !imageObject.removed) {
          cont++;
        }
      }

      if (cont > 3) {
        throw new Error('no more than 3 images are allowed');
      }

      return true;
    })
]

/**
 * Function to throw error if data or
 * removed fields don't pass the validations.
 */
const validateImageField = (field) => {
  const { data, removed } = field;

  // Validate that data is base64
  if (data && !isBase64(data)) {
    throw new Error('cover.data must be valid base64');  
  }

  if (removed !== undefined && typeof removed !== "boolean") {
    throw new Error('cover.removed must be boolean');
  }

  return;
}