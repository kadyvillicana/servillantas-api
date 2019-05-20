const IndicatorRecord       = require('../models/indicatorRecord'),
      Indicator             = require('../models/indicator')
      Place                 = require('../models/place'),
      mongoose              = require('mongoose'),
      databaseConfig        = require('../config/database'),
      complaintMap          = require('../helpers/complaints'),
      complaintsArray       = require('../constants/complaints'),
      moment                = require('moment');
                              require('moment/locale/es');

// Set es language
moment.locale('es');

mongoose.connect(databaseConfig().url, databaseConfig().options);

let complaintMapKeys = [];
let complaintMapData = {};
let complaintsToSave = [];
const indicatorId = "complaints"
const indicatorData = {
  "item": { id: 1, name: "Denuncia e investigación de la tortura/trato cruel, inhumano o degradante" },
  "version": "1",
  "indicatorName": "Denuncia e investigación de la tortura/trato cruel, inhumano o degradante",
  "shortName": "Número de denuncias",
  "indicatorId": indicatorId,
  "definition": "Total de denuncias por el delito de tortura y/o tratos crueles, inhumanos o degradantes. El dato de denuncias de extorsión se obtiene a partir de junio 2017 con la publicación de la Ley General sobre la Tortura y Otros Maltratos. El delito es clasificado como fuero federal, la Ciudad de México como fuero común según Artículo 1° de Ley General.",
  "calculationMethod": {
    "formula": "TDDT = Tt1 + Tt2 + Tt3...",
    "numerator": "Tt = Número de denuncias registradas en el periodo (t) para el área geográfica especificada.",
    "denominator": "TDDT = Total de denuncias por el delito de tortura"
  },
  "measurementFrequency": {
    "annual": true,
    "quarterly": true,
    "monthly": true
  },
  "geographicBreakdown": {
    "federal": true,
    "state": true,
    "municipal": true,
    "national": true
  },
  "source": ["www.senado.gob.mx","https://www.hchr.org.mx/"],
  "specialTreatment": "El dato de denuncias de extorsión se obtiene a partir de junio 2017 con la publicación de la Ley General sobre la Tortura y Otros Maltratos. El delito es clasificado como fuero federal, la Ciudad de México como fuero común según Artículo 1° de Ley General.",
  "indicatorWeaknesses": "El número real de delitos de tortura es mayor a aquellos denunciados"
  
}

Indicator.deleteOne({ indicatorId: indicatorId }, (err) => {
  if (err) {
    disconnect();
    return;
  }
  Indicator.create(indicatorData, (err) => {
    if (err) {
      disconnect();
      return;
    }
    // Delete all records that match the indicatorId before seeding
    IndicatorRecord.deleteMany({ indicatorId: indicatorId }, err => {
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
          let complaint = { indicatorId: indicatorId };
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

  })
})

const disconnect = () => {
  mongoose.disconnect();
}