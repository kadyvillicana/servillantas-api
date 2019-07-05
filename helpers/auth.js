const Friend = require('../models/friend');
const passport = require('passport');

exports.authorize = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, token, info) => {
    if(!token) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    Friend.findOne({ _id: token.id, deleted: false })
      .then(user => {
        if(!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        res.locals.user = user;
        next();
      })
      .catch(err => next(err));
  })(req, res, next)
}