const { param } = require('express-validator/check');

module.exports = [
    param('type', 'type field is required').exists(),
]