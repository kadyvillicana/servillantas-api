const expect              = require('chai').expect;
const Item                = require('../../../models/item');

describe('Item', () => {
  it ('should throw error if no title and content are provided when hasIndicators is false', async () => {
    const item = {
      name: '1',
      shortName: '1',
      hasIndicators: false,
    };

    try {
      await Item.create(item);
    } catch (err) {
      const valid = expect(err.errors.title.message).to.be.equal('title is required if this item has no indicators')
        && expect(err.errors.content.message).to.be.equal('content is required if this item has no indicators');
      return valid;
    }
  });
});