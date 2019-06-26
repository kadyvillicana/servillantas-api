const Indicator                   = require('../../models/indicator');
const ObjectId                    = require('mongoose').Types.ObjectId;
const Record                      = require('../../models/indicatorRecord');
const Item                        = require('../../models/item');
const { validationResult }        = require('express-validator/check');
const to                          = require('await-to-js').default;
const ERRORS                      = require('../../constants/errors');

// Get Indicators from DB
exports.getIndicators = (req, res, next) => {

  Indicator
    .find({ deleted: false }, ['_id', 'name', 'shortName', 'updatedAt', 'updatedBy', 'number'])
    .sort({ number: 1 })
    .populate({ path: 'itemId', select: '_id name shortName', match: { deleted: false } })
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

// Get Indicator by id
exports.getIndicator = (req, res, next) => {
  const { id } = req.params;

  Indicator.findOne({ _id: id, deleted: false })
    .populate({ path: 'itemId', select: '_id name shortName', match: { deleted: false } })
    .populate({ path: 'updatedBy', select: '_id name lastName' })
    .exec(async (err, indicator) => {
      if (err) {
        return next(err);
      }
      if (!indicator) {
        return res.status(404).send({ message: "Indicator not found", success: false });
      }

      return res.status(200).send({ data: await indicator.toJsonResponse(), success: true });
    });

}

// Create a new indicator
exports.addIndicator = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { itemId } = req.body;

  if (itemId) {
    const [errItem, item] = await to(Item.findOne({ _id: itemId, deleted: false }));
    if (errItem) {
      return next(errItem);
    }
  
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
  
    if (!item.hasIndicators) {
      return res.status(409).send({ errors: [{ item: 'Item does not accept indicators' }] });
    }
  }

  const { user } = res.locals;
  const indicatorObject = getIndicatorObject({ ...req.body, user });

  const [err, indicator] = await to(Indicator.create(indicatorObject));
  if (err) {

    let errors = [];
    // If this indicator's name is duplicated, return the error
    if (err.errors && err.errors.name) {
      errors.push({ name: ERRORS.DUPLICATE_NAME })
    }

    // If this indicator's shortName is duplicated, return the error
    if (err.errors && err.errors.shortName) {
      errors.push({ shortName: ERRORS.DUPLICATE_SHORTNAME })
    }
    
    if (errors.length) {
      return res.status(409).json({ errors });
    }

    return next(err);
  }

  return res.status(200).send({ data: await indicator.toJsonResponse(), success: true });
}

// Edit an indicator
exports.editIndicator = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { itemId } = req.body;
  const { id } = req.params;

  if (itemId) {
    const [errItem, item] = await to(Item.findOne({ _id: itemId, deleted: false }));
    if (errItem) {
      return next(errItem);
    }
  
    if (!item) {
      return res.status(404).send({ error: 'Item not found' });
    }
  
    if (!item.hasIndicators) {
      return res.status(409).send({ errors: [{ item: 'Item does not accept indicators' }] });
    }
  }

  const [errIndicator, indicator] = await to(Indicator.findOne({ _id: id, deleted: false }));
  if (errIndicator) {
    return next(errIndicator);
  }

  if (!indicator) {
    return res.status(404).send({ error: 'Indicator not found' });
  }

  const { user } = res.locals;
  const indicatorObject = getIndicatorObject({ ...req.body, user });

  // Apply new values
  indicator.itemId = indicatorObject.itemId;
  indicator.name = indicatorObject.name;
  indicator.definition = indicatorObject.definition;
  indicator.measurementFrequency = indicatorObject.measurementFrequency;
  indicator.geographicBreakdown = indicatorObject.geographicBreakdown;
  indicator.specialTreatment = indicatorObject.specialTreatment;
  indicator.indicatorWeaknesses = indicatorObject.indicatorWeaknesses;
  indicator.updatedBy = indicatorObject.updatedBy;
  indicator.calculationMethod = indicatorObject.calculationMethod;
  indicator.sources = indicatorObject.sources;

  const [err, _indicator] = await to(indicator.save());
  if (err) {

    let errors = [];
    // If this indicator's name is duplicated, return the error
    if (err.errors && err.errors.name) {
      errors.push({ name: ERRORS.DUPLICATE_NAME })
    }

    // If this indicator's shortName is duplicated, return the error
    if (err.errors && err.errors.shortName) {
      errors.push({ shortName: ERRORS.DUPLICATE_SHORTNAME })
    }
    
    if (errors.length) {
      return res.status(409).json({ errors });
    }

    return next(err);
  }

  return res.status(200).send({ data: await _indicator.toJsonResponse(), success: true });
}

/**
 * Function to generate the object to save
 * in mongo.
 * 
 * @param {object} values
 * 
 * @returns {object} Object with the values
 * that should be saved in the collection.
 */
const getIndicatorObject = (values) => {

  const {
    itemId,
    name,
    shortName,
    definition,
    calculationMethod,
    frequencies,
    geographicBreakdown,
    problems,
    sources,
    treatment,
    user,
  } = values;

  const indicator = {
    itemId,
    name: name.trim(),
    shortName: shortName.trim(),
    definition: definition && definition.trim(),
    measurementFrequency: frequencies,
    geographicBreakdown,
    specialTreatment: treatment && treatment.trim(),
    indicatorWeaknesses: problems && problems.trim(),
    updatedBy: user.id
  }

  const cmToSave = getCalculationMethod(calculationMethod);
  indicator.calculationMethod = cmToSave;

  const sourcesToSave = sources && getSources(sources);
  indicator.sources = sourcesToSave;

  return indicator;
}

/**
 * Get the object that should be stored in the collection.
 * 
 * @param {object} cm
 * 
 * @returns {object} Object with trimmed properties
 * or undefined if no properties were provided.
 */
const getCalculationMethod = (cm) => {
  const { formula, numerator, denominator } = cm || {};
  const formulaToSave = formula && formula.trim();
  const numeratorToSave = numerator && numerator.trim();
  const denominatorToSave = denominator && denominator.trim();

  let calculationMethod = {};

  if (formulaToSave) {
    calculationMethod.formula = formulaToSave;
  }

  if (numeratorToSave) {
    calculationMethod.numerator = numeratorToSave;
  }

  if (denominatorToSave) {
    calculationMethod.denominator = denominatorToSave;
  }

  if (!Object.keys(calculationMethod)) {
    calculationMethod = undefined;
  }

  return calculationMethod;
}

/**
 * Generate the value that should be stored in the collection.
 * 
 * If the result is an empty array, return undefined, so the
 * property is not created.
 * 
 * @param {Array} sources Array of strings.
 * 
 * @returns {Array} Return array of trimmed sources or undefined.
 */
const getSources = (sources) => {
  const sourcesToSave = sources.reduce((arr, s) => {
    const newSource = s.trim();
    if (s.trim().length) {
      return [
        ...arr,
        newSource
      ]
    }
    return arr;
  }, []);
  return sourcesToSave.length ? sourcesToSave : undefined;
}

// Delete an indicator
exports.deleteIndicator = async (req, res, next) => {
  const { user } = res.locals;
  const { params: { id } } = req;

  const [err, indicator] = await to(Indicator.findOneAndUpdate(
    { _id: id, deleted: false }, { $set: { deleted: true, updatedBy: user.id } }
  ));

  if (err) {
    return next(err);
  }

  if (!indicator) {
    return res.status(404).send({ error: 'Indicator not found' });
  }

  const [recErr] = await to(Record.deleteMany({ indicator: ObjectId(indicator._id) }));
  if (recErr) {
    return next(recErr);
  }

  return res.status(200).send({ data: indicator, success: true });
}