const Indicator                   = require('../../models/indicator');
const ObjectId                    = require('mongoose').Types.ObjectId;

//Get Indicators from DB that belong to item with the given id
exports.getIndicators = (req, res, next) => {

  Indicator
    .find({}, ['_id', 'name', 'shortName', 'createdAt', 'updatedBy', 'number'])
    .sort({ number: 1 })
    .populate({ path: 'itemId', select: '_id name shortName' })
    .populate({ path: 'updatedBy', select: '_id name lastName' })
    .exec((err, indicators) => {
      if (err) {
        return next(err);
      }
      if (!indicators || !indicators.length) {
        return res.status(200).send({ message: "There are no indicators", success: false });
      }
      return res.status(200).send({ data: indicators, success: true });
    });
}

//Get Indicators from DB that belong to item with the given id
exports.getIndicator = (req, res, next) => {
  const { id } = req.params;

  Indicator.find({ _id: ObjectId(id) })
    .populate({ path: 'itemId', select: '_id name shortName' })
    .populate({ path: 'updatedBy', select: '_id name lastName' })
    .exec((err, indicator) => {
      if (err) {
        return next(err);
      }
      if (!indicator) {
        return res.status(404).send({ message: "Indicator not found", success: false });
      }
      return res.status(200).send({ data: indicator, success: true });
    });

}
