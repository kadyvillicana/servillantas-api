const expect              = require('chai').expect;
const Item                = require('../../../models/item');
const DUPLICATE_NAME      = require('../../../constants/errors').DUPLICATE_NAME;

describe('Item', () => {
  it ('should not save duplicated records', async () => {
    const name = "Uno";
    const shortName = "1";
    const hasIndicators = true;
    const item = new Item ({ name, shortName, hasIndicators });
    await item.save();

    try {
      await Item.create({ name: "úno", shortName, hasIndicators });
      throw 'allowed creation';
    } catch (err) {
      return expect(err.errors.name.message).to.be.equal(DUPLICATE_NAME);
    }
  });
});