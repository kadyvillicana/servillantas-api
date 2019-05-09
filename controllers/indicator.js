const Indicator = require('../models/indicator'),
{ validationResult } = require('express-validator/check');
      
//Get all Indicators from DB
exports.getIndicators = (req, res, next) => {
  Indicator.find((err, indicators) => {
    if (err) {
      return next(err);
    }
    if (!indicators || !indicators.length) {
      return res.status(200).send({ message: "There are no indicators", success: false });
    }
    return res.status(200).send({data:indicators, success:true});
  });

}

//Create an indicator
exports.createIndicator = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let { item, 
        version, 
        indicatorName, 
        definition, 
        calculationMethod, 
        measurementFrequency, 
        geographicBreakdown, 
        specialTreatment, 
        indicatorWeaknesses } = req.body;
  var indicator = new Indicator({
    item: item,
    version: version,
    indicatorName: indicatorName,
    definition: definition,
    calculationMethod: calculationMethod,
    measurementFrequency: measurementFrequency,
    geographicBreakdown: geographicBreakdown,
    specialTreatment: specialTreatment,
    indicatorWeaknesses: indicatorWeaknesses,
    indicatorId: toLowerCase(concatenateDash(removeSpecialCharacters(item)))
  });

  Indicator.findOne({ indicatorId: indicator.indicatorId }, (err, _indicator) => {
    if (err) {
      return next(err);
    }

    if (_indicator) {
      return res.status(409).send({ error: 'That indicator already exists' });
    }

    indicator.save((err, indicator) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        message: "Indicator successfully added!",
        indicator: indicator
      });
    });
  });

}

//Returns only one Indicator by Id
exports.getIndicatorByIdentifier = (req, res, next) => {
  let identifier = req.params._id;

  if (!identifier) {
    return res.status(400).send({ error: 'You must enter an identifier' });
  }

  Indicator.findOne({ _id: identifier }, (err, indicator) => {
    if (err) {
      return next(err);
    }

    if (!indicator || indicator == null) {
      return res.status(404).json({
        error: "Indicator not found"
      });
    }

    return res.status(200).json({
      indicator: indicator
    });
  });
}

//Update an Indicator by its ID
exports.updateIndicator = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  Indicator.findByIdAndUpdate(req.params._id, {
    item: req.body.item,
    version: req.body.version,
    indicatorName: req.body.indicatorName,
    definition: req.body.redefinition,
    calculationMethod: req.body.calculationMethod,
    measurementFrequency: req.body.measurementFrequency,
    geographicBreakdown: req.body.geographicBreakdown,
    specialTreatment: req.body.specialTreatment,
    indicatorWeaknesses: req.body.indicatorWeaknesses,
    indicatorId: toLowerCase(concatenateDash(removeSpecialCharacters(req.body.item)))
  }, { new: true })
    .then(indicator => {
      if (!indicator) {
        return res.status(404).send({
          message: "Indicator not found with id " + req.params.productId
        });
      }
      res.send(indicator);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Indicator not found with id " + req.params.productId
        });
      }
      return res.status(500).send({
        message: "Something wrong updating note with id " + req.params.productId
      });
    });
};

//Delete an Indicator
exports.deleteIndicator = (req, res, next) => {
  Indicator.remove({
    _id: req.params._id
  }, function (err, indicator) {
    res.json(indicator);
  });
}
//Removes Special Characters on given String
function removeSpecialCharacters(string) {
  return string.replace(/[^\w\s]/gi, '');
}
//Adds a dash between the blank spaces on the Given String
function concatenateDash(string) {
  return string.replace(/ /g, '-');
}
//Lowercase the letters from the given String
function toLowerCase(string) {
  return string.toLowerCase();
}