const dataset1 = require('../constants/dataset1');
const dataset2 = require('../constants/dataset2');
const dataset3 = require('../constants/dataset3');

module.exports = () => {
  const index = Math.floor(Math.random() * 3);
  switch (index) {
    case 0: return dataset1;
    case 1: return dataset2;
    case 2:
    default: return dataset3;
  }
}