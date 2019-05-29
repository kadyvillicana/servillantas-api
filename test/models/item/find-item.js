const expect              = require('chai').expect,
      Item                = require('../../../models/item'),
      ObjectId            = require('mongoose').Types.ObjectId;

describe('Finding an item', () => {
  it ('should return an item when searching by id', async () => {
    
    item = new Item({ name: '1' });
    await item.save();

    const res = await Item.findById(ObjectId(item._id));
    return expect(res.name).to.be.equal(item.name);
  });
});