const Record                      = require('../../models/indicatorRecord');
const Place                       = require('../../models/place');
const { validationResult }        = require('express-validator/check');
const to                          = require('await-to-js').default;
const ObjectId                    = require('mongoose').Types.ObjectId;

exports.editRecords = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { records } = req.body;
  const { id } = req.params;
  const hash = `${id}-${new Date().getTime()}`;

  const [pErr, places] = await to(Place.find({}));
  if (pErr) {
    return next(pErr);
  }

  const foundPlaces = {};
  const recordsToSave = [];
  let placeErrors = [];

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const code = rec.place;

    const recordToAdd = {
      indicator: id,
      hash: hash,
      amount: rec.amount,
      date: rec.date,
    };

    if (foundPlaces[code]) {
      recordToAdd.state = foundPlaces[code];
    } else {
      const place = places.find((p) => p.code === rec.place);

      if (place) {
        foundPlaces[code] = place;
        recordToAdd.state = place;
      } else {
        placeErrors.push({ message: 'Place not found', place: rec.place });
      }
    }

    recordsToSave.push(recordToAdd);
  }

  if (placeErrors.length) {
    return res.status(409).send({ errors: placeErrors });
  }

  const [srErr] = await to(Record.insertMany(recordsToSave));
  if (srErr) {
    return next(srErr);
  }

  const [delErr] = await to(Record.deleteMany({ indicator: ObjectId(id), hash: { $ne: hash }}));
  if (delErr) {
    return res.status(200).send({ success: false, message: 'The new records were added but there was an error deleting the old ones' });
  }

  return res.status(200).json({ success: true });
}