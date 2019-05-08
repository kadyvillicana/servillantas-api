var Indicator = require('../models/indicator');

exports.getIndicators = (req, res, next) => {

    Indicator.find((err, indicators) => {

        if (err){
            res.send(err);
        }

        return res.status(200).send(indicators);

    });

}

exports.createIndicator = (req, res, next) => {

    var item = req.body.item;
    var indicatorName = req.body.indicatorName;
    var calculateMethod = req.body.calculateMethod;
    var measurementFrequency = req.body.measurementFrequency;
    var geographicBreakdown = req.body.geographicBreakdown;
    var specialTreatment = req.body.specialTreatment;
    var indicatorWeaknesses = req.body.indicatorWeaknesses;

    if(!indicatorName){
        return res.status(400).send({error: 'You must enter a name'});
    }

    var indicator = new Indicator({
      item: item,
      indicatorName: indicatorName,
      calculateMethod: calculateMethod,
      measurementFrequency: measurementFrequency,
      geographicBreakdown : geographicBreakdown,
      specialTreatment: specialTreatment,
      indicatorWeaknesses: indicatorWeaknesses,
      indicatorId: toLowerCase(removeWhiteSpace(removeSpecialCharecters(indicatorName)))
   });

    Indicator.findOne({identifier:indicator.identifier}, (err, _indicator) => {
      if(err){
        return next(err);
      }

      if(_indicator){
        return res.status(409).send({error: 'That indicator is already in our records'});
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

function removeSpecialCharecters(string){
    return string.replace(/[^\w\s]/gi, '');
  }
  
  function removeWhiteSpace(string){
    return string.replace(/ /g,'');
  }
  
  function toLowerCase(string){
    return string.toLowerCase();
  }