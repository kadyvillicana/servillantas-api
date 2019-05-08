var Indicator = require('../models/indicator');

exports.getIndicators = (req, res, next) => {
    Indicator.find((err, indicators) => {
      
        if (err){
            res.send(err);
        }
        if(indicators.length === 0){
          return res.status(200).send({ message: "There are no indicators", success: false });
        }
        return res.status(200).send(indicators);
    });

}

exports.createIndicator = (req, res, next) => {
    var item = req.body.item;
    var version = req.body.version;
    var indicatorName = req.body.indicatorName;
    var definition = req.body.definition;
    var calculationMethod = req.body.calculateMethod;
    var measurementFrequency = req.body.measurementFrequency;
    var geographicBreakdown = req.body.geographicBreakdown;
    var specialTreatment = req.body.specialTreatment;
    var indicatorWeaknesses = req.body.indicatorWeaknesses;
    if(!indicatorName){
        return res.status(400).send({error: 'Indicator must have a name'});
    }

    var indicator = new Indicator({
      item: item,
      version: version,
      indicatorName: indicatorName,
      definition: definition,
      calculationMethod: calculationMethod,
      measurementFrequency: measurementFrequency,
      geographicBreakdown : geographicBreakdown,
      specialTreatment: specialTreatment,
      indicatorWeaknesses: indicatorWeaknesses,
      indicatorId:toLowerCase(concatenateDash(removeSpecialCharacters(item)))
   });

    Indicator.findOne({indicatorId:indicator.indicatorId}, (err, _indicator) => {
      if(err){
        return next(err);
      }

      if(_indicator){
        return res.status(409).send({error: 'That indicator already exists'});
      }

      indicator.save((err, indicator) => {
            if(err){
                return next(err);
            }
            return res.status(200).json({
              message: "Indicator successfully added!",
              indicator: indicator
            });
        });
    });

}

exports.getIndicatorByIdentifier = (req, res, next) => {
  var identifier = req.params.identifier;

  if(!identifier){
      return res.status(400).send({error: 'You must enter an identifier'});
  }

  Indicator.findOne({identifier:identifier}, (err, indicator) => {
      if(err){
          return next(err);
      }

      if(!indicator || indicator == null){
        return res.status(404).json({
          error: "Indicator not found"
        });
      }

      return res.status(200).json({
        indicator: indicator
      });
  });
}

exports.deleteIndicator = (req, res, next) => {
  Indicator.remove({
      _id : req.params._id
  }, function(err, indicator) {
      res.json(indicator);
  });
}

function removeSpecialCharacters(string){
    return string.replace(/[^\w\s]/gi, '');
  }
  
  function concatenateDash(string){
    return string.replace(/ /g,'-');
  }
  
  function toLowerCase(string){
    return string.toLowerCase();
  }