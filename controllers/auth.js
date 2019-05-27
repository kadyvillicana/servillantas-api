const User = require('../models/user'),
  passport = require('passport'),
  nodemailer = require('nodemailer'),
  crypto = require('crypto'),
  bcryptjs = require('bcryptjs'),
  BCRYPT_SALT_ROUNDS = 12;


exports.register = (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  if (!email) {
    return res.status(400).send({ error: 'You must enter an email address' });
  }

  if (!password) {
    return res.status(400).send({ error: 'You must enter a password' });
  }

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
  const { email, password } = req.body;
  if (!email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
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
  if (!req.body.email) {
    res.json('Email Required')
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      res.json("email not found")
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
        subject: 'Link to reset Password',
        text: "Este es un mensaje de prueba accede a la siguiente pagina para cambiar tu password\n\n" +
          process.env.MAIN_URL + token
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log("Error: ", err);
        } else {
          res.status(200).json('recovery email sent');
        }
      });
    }
  });
}

exports.resetPassword = (req, res, next) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then(user => {
    if (!user) {
      res.status(401).send({error: 'link is invalid or has expired'})
    } else {
      res.status(200).send({
        username: user.email,
        token: req.params.token,
        message: 'password reset is active'
      })
    }
  })
}

exports.updatePasswordByEmail = (req, res, next) => {
  User.findOne({ email: req.body.email, resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).then(user => {
    if(user){
        user.password = req.body.password;
        user.resetPasswordExpires = null;
        user.resetPasswordToken = null;
        user.save().then((result) => {
          res.status(200).send({message: 'pass updated'})
        })
    }
    else{
      res.status(404).json('email not found')
    }
  })
}

