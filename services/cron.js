const cron                              = require('node-cron');
const { sendReminder, setNextBeerDate } = require('../controllers/friend');

module.exports.start = () => {
  // Cron to update next beer date
  cron.schedule("0 12 * * 5", function() {
    setNextBeerDate();
  });
  
  // Cron to send remainder
  cron.schedule("15 12 * * 3", function() {
    sendReminder();
  });
}
