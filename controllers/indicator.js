const Indicator                   = require('../models/indicator');
const ObjectId                    = require('mongoose').Types.ObjectId;

//Get Indicators from DB that belong to item with the given id
exports.getIndicators = (req, res, next) => {
  const { itemId } = req.params;
  Indicator.find({ item: ObjectId(itemId) }, (err, indicators) => {
    if (err) {
      return next(err);
    }
    if (!indicators || !indicators.length) {
      return res.status(200).send({ message: "There are no indicators", success: false });
    }
    return res.status(200).send({ data: indicators, success: true });
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
