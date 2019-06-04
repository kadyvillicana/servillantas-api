const expect              = require('chai').expect;
const Item                = require('../../../models/item');

describe('Item', () => {
  it ('should not save duplicated records', async () => {
    const name = "1";
    const item = new Item ({ name: name });
    await item.save();

    try {
      await Item.create({ name: name });
    } catch (err) {
      return expect(err.errors.name.message).to.be.equal("Name already exists");
    }
  });
});