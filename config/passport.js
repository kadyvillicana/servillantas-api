const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const crypto               = require('crypto');
const passport = require('passport');
const User = require('../models/user');




//Passport middleware to verify if data received is on DB
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        return done(null, false, { message: 'email not registered' })
      }

      bcryptjs.compare(password, user.password, (err, isMatch) => {

        if (err) throw err;
        if (isMatch) {
          if (!user.verified) {
            const token = crypto.randomBytes(20).toString('hex');
            user.updateOne({
              resetPasswordToken: token,
              resetPasswordExpires: Date.now() + 3600000,
            }, (err) => {
              if (err) {
                return done(null, false, { message: 'Something Went Wrong' })
              }})
            return done(null, false, { message: 'Change default password', token: token })
          }
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      })
    })
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
