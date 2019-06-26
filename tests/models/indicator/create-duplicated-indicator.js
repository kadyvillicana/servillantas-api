const expect              = require('chai').expect;
const Indicator           = require('../../../models/indicator');
const DUPLICATE_NAME      = require('../../../constants/errors').DUPLICATE_NAME;

describe('Indicator', () => {
  it ('should not save duplicated records', async () => {
    const name = "Uno";
    const shortName = "1";
    const indicator = new Indicator ({ name, shortName });
    await indicator.save();

    try {
      await Indicator.create({ name: "úno", shortName: "2" });
      throw 'allowed creation';
    } catch (err) {
      return expect(err.errors.name.message).to.be.equal(DUPLICATE_NAME);
    }
  });
});