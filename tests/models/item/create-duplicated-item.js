const expect              = require('chai').expect;
const Item                = require('../../../models/item');
const DUPLICATE_NAME      = require('../../../constants/errors').DUPLICATE_NAME;

describe('Item', () => {
  it ('should not save duplicated records', async () => {
    const name = "1";
    const shortName = "1";
    const hasIndicators = true;
    const item = new Item ({ name, shortName, hasIndicators });
    await item.save();

    try {
      await Item.create({ name, shortName, hasIndicators });
    } catch (err) {
      return expect(err.errors.name.message).to.be.equal(DUPLICATE_NAME);
    }
  });
});