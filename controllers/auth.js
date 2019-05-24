var User       = require('../models/user');
var passport   = require('passport');

exports.register = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;

    if(!email){
        return res.status(400).send({error: 'You must enter an email address'});
    }

    if(!password){
        return res.status(400).send({error: 'You must enter a password'});
    }

    User.findOne({email:email}, function(err, existingUser){
    
        if(err){
            return next(err);
        }

        if(existingUser){
            return res.status(409).send({error: 'That email address is already in use'});
        }

        var user = new User({
            email: email,
            password: password,
        });
        
        user.save(function(err, user){
            if(err){
                return next(err);
            }
            res.status(201).json({
                user: user
            })
        });
    });
}

exports.login = (req, res, next) => {
    const { email, password  } = req.body;
    if(!email) {
        return res.status(422).json({
          errors: {
            email: 'is required',
          },
        });
      }
    
      if(!password) {
        return res.status(422).json({
          errors: {
            password: 'is required',
          },
        });
      }
 
      return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if(err) {
          return next(err);
        }

        if(passportUser) {
          const user = passportUser;
          user.token = passportUser.generateJWT();
    
          return res.json({ user: user.toAuthJSON() });
        }

        return res.status(400).json({error: info})
      })(req, res, next);
  };

  exports.logout = (req,res,next) =>{
    req.logout();
    res.send({message: "sign out"})
  }