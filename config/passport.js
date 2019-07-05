const LocalStrategy       = require('passport-local').Strategy;
const passport            = require('passport');
const passportJWT         = require('passport-jwt');
const JWTStrategy         = passportJWT.Strategy;
const ExtractJTW          = passportJWT.ExtractJwt;
const Friend              = require('../models/friend');
const ActiveDirectory     = require('activedirectory');
const adCondig            = require('../config/activedirectory');
const AD                  = new ActiveDirectory(adCondig.config);

/**
 * JWTStrategy to validate if the request has a valid token
 */
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJTW.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PASSPORT_SECRET
}, function(jwtPayload, cb) {
  return cb(null, jwtPayload);
}))

//Passport middleware to verify if data received is on DB
passport.use(
  new LocalStrategy({ usernameField: 'username' }, (username, password, callback) => {

    AD.authenticate("SCIO\\" + username, password, function(err, auth) {
      if (err || !auth) {
        return callback(err, false, {message: 'Error during authentication' });
      }
      AD.findUser(username, function(err, user) {
        if (err || !user) {
          return callback(err, false, {message: 'Incorrect email or password' });
        }

        Friend.findOne({
          username,
          deleted: false
        })
          .then(friend => {
            if (!friend) {
              return callback(null, false, { message: 'Friend not invited to party' });
            }
            return callback(null, friend, { message: "Logged in Successfully" });
          })
          .catch(err => callback(err));

      });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Friend.findById(id).then((user) => {
    done(null, user);
  }).catch(done);
});
