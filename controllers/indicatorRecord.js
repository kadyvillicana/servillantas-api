const IndicatorRecord    = require('../models/indicatorRecord'),
    { validationResult } = require('express-validator/check'),
    moment               = require('moment');

/**
 * Function to get all indicator records that match the type
 * and date if specified.
 * 
 * @returns
 *  If there are records: array of objects grouped by state and with sum of each property, success = true.
 *  Else, error message, success = false.
 */
exports.get = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { type } = req.params;
  const { year, quarter, month } = req.query;
  const search = { indicatorId: type };

  const momentDate = moment().utcOffset(0);
  // Ignore time and set 1st day of the month
  momentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).set('date', 1);

  // If year was specified
  if (year) {
    momentDate.year(year);
    search.date = {};
    search['date']['$gte'] = momentDate.clone().startOf('year');
    search['date']['$lt'] = momentDate.clone().endOf('year');

    // If quarter was specified
    // 1 = January - March
    // 2 = April - June
    // 3 = July - September
    // 4 = October - December
    if (quarter !== undefined) {
      momentDate.quarter(quarter);
      search['date']['$gte'] = momentDate.clone().startOf('quarter');
      search['date']['$lt'] = momentDate.clone().endOf('quarter');
    }

    // If month was specified
    // 0 = January
    if (month !== undefined) {
      momentDate.month(month);
      search['date']['$gte'] = momentDate.clone().startOf('month');
      search['date']['$lt'] = momentDate.clone().endOf('month');
    }
  
    // Get js Date from moment
    if (search.date) {
      search['date']['$gte'] = search['date']['$gte'].toDate();
      search['date']['$lt'] = search['date']['$lt'].toDate();
    }
  }

  IndicatorRecord.aggregate([
    { $match: search },
    { $lookup: {
      from: 'places',
      localField: 'state',
      foreignField: '_id',
      as:'state'
      }
    },
    {
      $group: {
        _id: '$state._id',
        state: { $first: '$$ROOT.state' },
        totalAmount: { $sum: '$$ROOT.amount' },
        totalMale: { $sum: '$$ROOT.gender.male' },
        totalFemale: { $sum: '$$ROOT.gender.female' },
        totalComplaint: { $sum: '$$ROOT.investigationFolder.complaint' },
        totalJudicialHearing: { $sum: '$$ROOT.investigationFolder.judicialHearing' },
        totalOtherReasons: { $sum: '$$ROOT.investigationFolder.otherReasons' }
      }
    },
    {
      $project: {
        _id: 0,
        state: {
          $let: {
            vars: {
              stateData: {
                $arrayElemAt: [ '$state', 0 ]
              }
            },
            in: {
              type: '$$stateData.type',
              name: '$$stateData.name',
              code: '$$stateData.code'
            }
          },
        },
        totalAmount: 1,
        totalMale: 1,
        totalFemale: 1,
        totalComplaint: 1,
        totalJudicialHearing: 1,
        totalOtherReasons: 1,
      }
    },
    {
      $sort: { totalAmount: -1 } // DESC
    },
  ]).exec((err, results) => {
    if (err) {
      return next(err);
    }

    if (!results || !results.length) {
      return res.status(200).send({ message: "There are no records", success: false });
    }

    res.status(200).send({ data: results, success: true });
  });
}

/**
 * Get the date of the first and last records available for the requested indicator.
 * 
 * @returns If there are records matching the request return the oldest and newest date. 
 */
exports.getDates = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { type } = req.params;

  IndicatorRecord.aggregate([
    {
      $match: { indicatorId: type }
    },
    {
      $group: {
        _id: null,
        minDate: { $min: '$$ROOT.date' },
        maxDate: { $max: '$$ROOT.date' }
      }
    },
    {
      $project: {
        _id: 0,
      }
    }
  ]).exec((err, result) => {
    if (err) {
      return next(err);
    }

    if (!result.length) {
      return res.status(200).send({ message: "There are no records", success: false });
    }

    return res.status(200).send({ data: result[0], success: true });
  })

}