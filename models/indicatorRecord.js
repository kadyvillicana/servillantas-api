var mongoose = require('mongoose');

var indicatorRecordSchema = new mongoose.Schema({
    date: Date,
    state: String,
    complaints: {
        gender: String,
        responsibleAuthority: String,
    },
    folderNumbers: {
        complaint: Number,
        judicialHearing: Number,
        otherReasons: Number,
    }
},{
    timestamps:true
});

module.exports = mongoose.model('indicatorRecord', indicatorRecordSchema);