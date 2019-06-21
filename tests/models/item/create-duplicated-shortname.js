const expect              = require('chai').expect;
const Item                = require('../../../models/item');
const DUPLICATE_SHORTNAME = require('../../../constants/errors').DUPLICATE_SHORTNAME;

describe('Item', () => {
  it ('should not save duplicated short names', async () => {
    const name = "Long name";
    const shortName = "long";
    const hasIndicators = true;
    const item = new Item ({ name, shortName, hasIndicators });
    await item.save();

    try {
      await Item.create({ name: "Different", shortName: "long", hasIndicators });
      throw 'allowed creation';
    } catch (err) {
      return expect(err.errors.shortName.message).to.be.equal(DUPLICATE_SHORTNAME);
    }
  });
});