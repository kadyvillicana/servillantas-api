const User      = require('./models/user');
const passport  = require('passport');

exports.isDeleted = (req, res, next) => {passport.authenticate('jwt', {session: false}, (err, token, info) => {
  if(!token){
    return res.status(401).json({ error: "invalid token" });
  }
  User.findOne({_id: token.id, deleted: false})
    .then((user) => {
      if(!user){
        return res.status(401).json({ error: "user not found" });
      }
      res.locals.user = user;
      next();
    })
    .catch((err) => next(err));
})(req, res, next)}