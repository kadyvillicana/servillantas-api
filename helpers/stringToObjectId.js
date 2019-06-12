const mongoose = require('mongoose');

module.exports = (id) => {
  return mongoose.Types.ObjectId(id);
}