const expect              = require('chai').expect;
const Indicator           = require('../../../models/indicator');
const DUPLICATE_SHORTNAME = require('../../../constants/errors').DUPLICATE_SHORTNAME;

describe('Indicator', () => {
  it ('should not save duplicated short names', async () => {
    const name = "Long name";
    const shortName = "long";
    const indicator = new Indicator ({ name, shortName });
    await indicator.save();

    try {
      await Indicator.create({ name: "Different", shortName: "long" });
      throw 'allowed creation';
    } catch (err) {
      return expect(err.errors.shortName.message).to.be.equal(DUPLICATE_SHORTNAME);
    }
  });
});