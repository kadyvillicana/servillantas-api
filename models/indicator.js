const mongoose = require('mongoose');

const IndicatorSchema = new mongoose.Schema({
    item: String,

    version: String,

    indicatorId: String,

    indicatorName: String,

    definition: String,

    calculateMethod: {
        formula: String,
        numerator: String,
        denominator: String
    },

    measurementFrequency: {
        annual: Boolean,
        quarterly: Boolean,
        monthly: Boolean
    },

    geographicBreakdown: {
        federal: Boolean,
        state: Boolean,
        municipal: Boolean,
    },

    specialTreatment: String,
    
    indicatorWeaknesses: String,
});

module.exports = mongoose.model('Indicator', IndicatorSchema);