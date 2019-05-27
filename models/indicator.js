var mongoose = require('mongoose');

var IndicatorSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    },
    version: String,
    indicatorId: String,
    indicatorName: String,
    shortName: String,
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
        national: Boolean
    },
    specialTreatment: String,
    indicatorWeaknesses: String,

    processedIndicator: String,
    source: [{type: String}],
    recollectionMethod: String,
    disintegration: String,
}, {
        timestamps: true
    });

module.exports = mongoose.model('Indicator', IndicatorSchema);