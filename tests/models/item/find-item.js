const expect              = require('chai').expect;
const Item                = require('../../../models/item');
const ObjectId            = require('mongoose').Types.ObjectId;

describe('Finding an item', () => {
  it ('should return an item when searching by id', async () => {
    
    const name = "1";
    const shortName = "1";
    const hasIndicators = true;
    const item = new Item({ name, shortName, hasIndicators });
    await item.save();

    const res = await Item.findById(ObjectId(item._id));
    return expect(res.name).to.be.equal(item.name);
  });
});