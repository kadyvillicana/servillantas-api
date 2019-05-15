const { param } = require('express-validator/check');

module.exports = [
    param('indicatorId', 'indicatorId is required').exists(),
]