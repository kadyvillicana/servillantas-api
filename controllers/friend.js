const Friend            = require('../models/friend');
const mail              = require('../services/mail');

/**
 * Function to get all the items available.
 * 
 * @returns {Array} Model Item
 */
exports.getItems = (req, res, next) => {
  Friend.find({ deleted: false }, ['name', 'favoriteBeer', 'profileImage', ], { sort: { nextBeerDate: 1 } }, (err, items) => {
    if (err) {
      return next(err);
    }

    if (!items.length) {
      return res.status(200).send({ message: "There are no friends", success: false });
    }

    return res.status(200).send({ data: items, success: true });
  });
}

/**
 * Function to get the last friend in row.
 * 
 * @returns {Friend} Model Item
 */
exports.getLastFriendInRow = (req, res, next) => {

  Friend.aggregate([
    { $sort: { nextBeerDate: 1 }},
    { $limit : 1 },
  ], (err, item) => {
    if (err) {
      return next(err);
    }

    if (!item.length) {
      return res.status(200).send({ message: "There is not friend", success: false });
    }

    const friend = {
      name: item[0].name,
      favoriteBeer: item[0].favoriteBeer,
      profileImage: item[0].profileImage
    }

    return res.status(200).send({ data: friend, success: true });
  });
}

exports.getFriendInfo = (req, res, next) => {

  Friend.findOne({_id: res.locals.user.id}, ['email', 'favoriteBeer', 'profileImage', 'name'], (err, user) => {
    if(err) {
      return next(err);
    }
    res.status(200).send(user);
  });
}

exports.sendReminder = () => {
  Friend.find({ deleted: false }, ['email'], { sort: { nextBeerDate: 1 } }, async(err, items) => {
    if (err) {
      throw err
    }

    if (!items.length) {
      throw "no users"
    }

    const mailData = {
      subject: 'Friendly Reminder',
      text: `This week our host is ${items[0].name}. Do not forget to bring beers next thursday.`
    };
    
    let emails = items.map(i => {return i.email}).join();

    try {
      await mail(emails, mailData);
    }
    catch (err) {
      throw err
    }

  });
}

exports.setNextBeerDate = () => {
  Friend.find({ deleted: false }, ['name', 'favoriteBeer', 'profileImage', 'nextBeerDate',], { sort: { nextBeerDate: 1 } }, (err, items) => {
    if (err) {
      throw Error;
    }

    if (!items.length) {
      throw({ message: "There are no friends"});
    }

    let friendToUpdate = items[0];

    let lastFriendDate = items[items.length - 1].nextBeerDate;

    let nextBeerDate = lastFriendDate + 10;

    Friend.updateOne(
      { _id: friendToUpdate.id }, 
      { $set: { "nextBeerDate" : nextBeerDate, } },
      (err) => {
        if(err) {
          throw err
        }
      }
    );
  });
}