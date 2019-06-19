const characters              = require('../constants/characters');

module.exports = length => {
  let result = '';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}