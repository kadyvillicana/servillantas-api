var mongoose = require('mongoose');

var IndicatorSchema = new mongoose.Schema({
    item: {
        type: String, 
        unique: true
    },
    version: String,
    indicatorId: String,
    indicatorName: String,
    definition: String,
    calculationMethod: {
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
},{
    timestamps: true
});

module.exports = mongoose.model('Indicator', IndicatorSchema);