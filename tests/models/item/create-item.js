const expect              = require('chai').expect;
const Item                = require('../../../models/item');

describe('Item', () => {
  it ('should create a new item', (done) => {
    const item = new Item({
      name: '1',
      shortName: '1',
      hasIndicators: true,
    });

    item.save()
      .then(() => {
        expect(item.isNew).to.be.equal(false);
        done();
      });
  });
});