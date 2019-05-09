const IndicatorRecord     = require('../models/indicatorRecord'),
    Place                 = require('../models/place'),
    mongoose              = require('mongoose'),
    databaseConfig        = require('../config/database'),
    complaintMap          = require('../helpers/complaints'),
    complaintsArray       = require('../constants/complaints'),
    indicatorIds          = require('../constants/indicatorIds'),
    moment                = require('moment');
                            require('moment/locale/es');

// Set es language
moment.locale('es');

mongoose.connect(databaseConfig().url, databaseConfig().options);

let complaintMapKeys = [];
let complaintMapData = {};
let complaintsToSave = [];

// Delete all records that match the indicatorId before seeding
IndicatorRecord.deleteMany({ indicatorId: indicatorIds.COMPLAINT }, err => {
  if (err) {
    disconnect();
    return;
  }

  Place.find({}, (err, places) => {
    if (err) {
      disconnect();
      return;
    }

    const momentDate = moment().utcOffset(0);
    // Ignore time and set 1st day of the month
    momentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).set('date', 1);
  
    // Iterate array of complaints (object with year, month, and each state as key)
    for (let i = 0; i < complaintsArray.length; i++) {

      // Object to save in db
      let complaint = { indicatorId: indicatorIds.COMPLAINTS };
      // Object to save year and month
      let date = {};

      // Iterate through each object
      for (let [key, value] of Object.entries(complaintsArray[i])) {

        // Object to save the key (year, month or state code) and property to know if the object is a place
        let complaintMapProps = {};

        // If the key has been found on a previous iteration, set complaintMapProps with the data
        // Else, iterate through the array helper to find the matching key and set complaintMapProps
        if (complaintMapKeys.includes(key) && hash[key] !== undefined) {
          complaintMapProps.key = key;
          complaintMapProps.isPlace = hash[key].isPlace;
        } else {
          for (let [cKey, cValue] of Object.entries(complaintMap)) {
            if (cValue.names.includes(key.toLocaleLowerCase())) {
              complaintMapKeys = [...complaintMapKeys, cKey];
              complaintMapData = { ...complaintMapData, [cKey]: cValue }
              complaintMapProps.key = cKey;
              complaintMapProps.isPlace = cValue.isPlace;
              break;
            }
          }
        }

        // If the current key is a place, find the reference on Places and create the object to save in the database
        // If the current key is related to the date, add it to the date object
        if (complaintMapProps.isPlace) {
          const place = places.find(p => p.code === complaintMapProps.key);
          if (place) {
            complaint.state = place;
            complaint.amount = value;
            complaint.date = momentDate.year(date.year).month(date.month || 0).format('YYYY-MM-DD HH:mm:ss');
            complaintsToSave = [
              ...complaintsToSave,
              new IndicatorRecord(complaint)
            ];
          }
        } else if (complaintMapProps.key === 'year') {
          date.year = value;
        } else if (complaintMapProps.key === 'month') {
          date.month = value;
        }
      }
    }
  
    // Save the objects in the database
    if (complaintsToSave.length) {
      IndicatorRecord.insertMany(complaintsToSave, (err) => disconnect());
    } else {
      disconnect();
    }
  });
});

const disconnect = () => {
  mongoose.disconnect();
}