const IndicatorRecord              = require('../models/indicatorRecord'),
      Item                         = require('../models/item'),
      Indicator                    = require('../models/indicator'),
      Place                        = require('../models/place'),
      databaseConfig               = require('../config/database'),
      complaintMap                 = require('../helpers/complaints'),
      items                        = require('../helpers/items-array')(),
      mockIndicators               = require('../helpers/mock-indicators'),
      getDataSet                   = require('../helpers/get-random-dataset'),
      entries                      = require('../helpers/entries-polyfill'),
      mongoose                     = require('mongoose'),
      moment                       = require('moment');
                                     require('moment/locale/es');

// Set es language
moment.locale('es');

mongoose.Promise = Promise;
mongoose.connect(databaseConfig().url, databaseConfig().options);

let complaintMapKeys = [];
let complaintMapData = {};

/** TODO: use promise.all */
const seed = async () => {

  try {
    // Delete all indicators
    await Indicator.deleteMany({}).exec();

    // Delete all records
    await IndicatorRecord.deleteMany({}).exec();

    // Iterate through items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Find the item to later add the reference to the indicator
      const _item = await Item.findOne({ name: item.name }).exec();

      // Find the object with the indicators that belong to this item
      const itemData = mockIndicators[item.name];

      // If the item has indicators
      if (itemData && itemData.indicators) {

        // Iterate through the indicators for creation
        for (let j = 0; j < itemData.indicators.length; j++) {

          // Add the item reference to the indicator before saving
          const indicatorToSave = Object.assign(itemData.indicators[j], { item: _item });
          const _indicator = await Indicator.create(indicatorToSave);

          const places = await Place.find({}).exec();

          const momentDate = moment().utcOffset(0);
          // Ignore time and set 1st day of the month
          momentDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).set('date', 1);

          let complaintsToSave = [];
          let dataSet = getDataSet();
          // Iterate array of complaints (object with year, month, and each state as key)
          for (let i = 0; i < dataSet.length; i++) {

            // Object to save in db
            let complaint = { indicator: _indicator };
            // Object to save year and month
            let date = {};

            // Iterate through each object
            for (let [key, value] of entries(dataSet[i])) {

              // Object to save the key (year, month or state code) and property to know if the object is a place
              let complaintMapProps = {};

              // If the key has been found on a previous iteration, set complaintMapProps with the data
              // Else, iterate through the array helper to find the matching key and set complaintMapProps
              if (complaintMapKeys.includes(key) && hash[key] !== undefined) {
                complaintMapProps.key = key;
                complaintMapProps.isPlace = hash[key].isPlace;
              } else {
                for (let [cKey, cValue] of entries(complaintMap)) {
                  if (cValue.names.includes(key.toLocaleLowerCase())) {
                    complaintMapKeys = [...complaintMapKeys, cKey];
                    complaintMapData = Object.assign(complaintMapData, { [cKey]: cValue });
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
            await IndicatorRecord.insertMany(complaintsToSave);
          }

        }

      }

    }

  } catch (e) {
    disconnect();
  }
  disconnect();
}

seed();

const disconnect = () => {
  mongoose.disconnect();
}