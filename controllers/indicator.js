var Indicator = require('../models/artist');

exports.getIndicators = (req, res, next) => {

    Indicator.find((err, indicators) => {

        if (err){
            res.send(err);
        }

        return res.status(200).send(indicators);

    });

}