const Record                      = require('../../models/indicatorRecord');
const Place                       = require('../../models/place');
const Indicator                   = require('../../models/indicator');
const { validationResult }        = require('express-validator/check');
const to                          = require('await-to-js').default;
const ObjectId                    = require('mongoose').Types.ObjectId;

/**
 * Add the new records of this indicator.
 * First find the places and add them to each record.
 * After successfully inserting the records, delete the
 * old ones.
 */
exports.editRecords = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { id } = req.params;

  // Validate the indicator exists
  const [inErr] = await to(Indicator.findOne({ _id: id }));
  if (inErr) {
    return res.status(404).send({ error: 'Indicator not found' });
  }

  const { records } = req.body;
  // Create the unique value for these records
  const hash = `${id}-${new Date().getTime()}`;

  const [pErr, places] = await to(Place.find({}));
  if (pErr) {
    return next(pErr);
  }

  // Object to store the places found to avoid using .find for each record
  const foundPlaces = {};
  // Array with the objects that will be stored
  const recordsToSave = [];
  // Array to store errors in case a place is not found
  let placeErrors = [];

  // Iterate through all the records to add the place ref
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const code = rec.place;

    // Initialize the object to save
    const recordToAdd = {
      indicator: id,
      hash: hash,
      amount: rec.amount,
      date: rec.date,
    };

    // If the place is already in the object, just add the reference
    if (foundPlaces[code]) {
      recordToAdd.state = foundPlaces[code];
    } else {
      const place = places.find((p) => p.code === rec.place);

      // If the place is found, add the reference
      if (place) {
        foundPlaces[code] = place;
        recordToAdd.state = place;
      } else {
        placeErrors.push({ message: 'Place not found', place: rec.place });
      }
    }

    // Add a new object
    recordsToSave.push(recordToAdd);
  }

  // If some place could not be found, respond with error
  if (placeErrors.length) {
    return res.status(409).send({ errors: placeErrors });
  }

  // Save the new records
  const [srErr] = await to(Record.insertMany(recordsToSave));
  if (srErr) {
    return next(srErr);
  }

  // Delete the old records
  const [delErr] = await to(Record.deleteMany({ indicator: ObjectId(id), hash: { $ne: hash }}));
  if (delErr) {
    return res.status(200).send({ success: false, message: 'The new records were added but there was an error deleting the old ones' });
  }

  return res.status(200).json({ success: true });
}

// Delete the records of an indicator
exports.deleteRecords = async (req, res, next) => {
  const { id } = req.params;

  const [err] = await to(Record.deleteMany({ indicator: ObjectId(id) }));
  if (err) {
    return next(err);
  }

  return res.status(200).send({ success: true });
}