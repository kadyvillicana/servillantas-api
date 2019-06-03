const User                 = require('../models/user'),
      passport             = require('passport'),
      nodemailer           = require('nodemailer'),
      { validationResult } = require('express-validator/check'),
      crypto               = require('crypto');


exports.register = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var email = req.body.email;
  var password = req.body.password;
 
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(409).send({ error: 'That email address is already in use' });
    }

    var user = new User({
      email: email,
      password: password,
    });

    user.save(function (err, user) {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        user: user
      })
    });
  });
}

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(400).json({ error: info })
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  res.send({ message: "sign out" })
}

exports.forgotPassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      res.status(404).json("email not found")
    }
    else {
      const token = crypto.randomBytes(20).toString('hex');
      user.updateOne({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000,
      }, (err, res) => {});

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Link para recuperar tu password',
        text: "Este es un mensaje de prueba accede a la siguiente pagina para cambiar tu contraseña\n\n" +
          process.env.APP_URL+"recoverpassword/"+ token
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log("Error: ", err);
        } else {
          res.status(200).json('Recover Password email has been sent');
        }
      });
    }
  }).catch (err => {
    res.status(500).send({message: err})
  });
}

exports.updatePasswordByEmail = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  
  User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then(user => {
    if(user){
        user.password = req.body.password;
        user.resetPasswordExpires = null;
        user.resetPasswordToken = null;
        user.save().then((result) => {
          res.status(200).send({message: 'pass updated'})
        }).catch (err => {
          res.status(500).send({message: err})
        })
    }
    else{
      res.status(404).json('Change password link has expired')
    }
  }).catch (err => {
    res.status(500).send({message: err})
  })
}

