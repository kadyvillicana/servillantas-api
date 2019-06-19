const User                    = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.find({}, ['_id', 'email', 'name', 'lastName', 'role'], { sort: { createdAt: 1 } }, (err, items) => {
    if (err) {
      return next(err);
    }
  
    if (!items.length) {
      return res.status(200).send({ message: "There are no users", success: false });
    }
    return res.status(200).send({ data: items, success: true });
  });
}

exports.getUser = (req, res, next) => {
  const { _id } = req.params;
  
  User.findOne({ _id: _id }, async (err, item) => {
    if (err) {
      return next(err);
    }
  
    if (!item) {
      return res.status(404).send({ message: "User not found"});
    }
  
    return res.status(200).send({ data: await item, success: true });
  });
}