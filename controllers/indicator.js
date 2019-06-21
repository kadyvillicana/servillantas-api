const Indicator                   = require('../models/indicator');
const ObjectId                    = require('mongoose').Types.ObjectId;

//Get Indicators from DB that belong to item with the given id
exports.getIndicators = (req, res, next) => {
  const { itemId } = req.params;
  Indicator.find({ itemId: ObjectId(itemId) }, (err, indicators) => {
    if (err) {
      return next(err);
    }
    if (!indicators || !indicators.length) {
      return res.status(200).send({ message: "There are no indicators", success: false });
    }
    return res.status(200).send({ data: indicators, success: true });
  });
}
