const User = require('../models/user'),
  passport = require('passport'),
  nodemailer = require('nodemailer'),
  crypto = require('crypto');

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
  console.log(req.body.email)
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      console.log('email not found');
      res.json("email not found")
    }
    else {
      const token = crypto.randomBytes(20).toString('hex');
      console.log(token);
      user.updateOne( {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 360000,
      }, (err, res) => {console.log("hola")});
      console.log(user)

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        },
      });

      const mailOptions = {
        from: 'sciotestmail@gmail.com',
        to: 'cmoreno@sciode.com',
        subject: 'Link to reset Password',
        text: "Este es un mensaje de prueba accede a la siguiente pagina para cambiar tu password\n\n" +
          "localhost:3000/reset/" + token
      };
      console.log("sending mail")

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log("Error: ", err);
        } else {
          console.log("this is res: ", response)
          res.status(200).json('recovery email sent');
        }
      });
    }
  });
}

exports.resetPassword = (req, res, next) => {
  console.log(req)
  User.findOne({ resetPasswordToken: req.query.resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } }).then(user => {
    if(!user){
      console.log('link is invalid or has expired');
      res.json('link is invalid or has expired')
    } else{
      res.status(200).send({
        username:user.email,
        message: 'password reset link ok'
      })
    }
  })
}

