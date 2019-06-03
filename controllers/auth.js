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

exports.logout = (req, res) => {
  req.logout();
  res.send({ message: "sign out" })
}

exports.forgotPassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return res.status(404).json({error: "Email not found"})
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.updateOne({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 360000,
    }, (err) => {
      if (err) {
        return next(err)
      }
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
        subject: 'Cambio de contraseña',
        text: "Este mensaje ha sido enviado porque solicitaste reestablecer tu contraseña, haz clic en el enlace para continuar con esta operación\n\n" +
          process.env.APP_URL + "recoverpassword/" + token
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          next(err)
        } else {
          res.status(200).send({message: 'Recover Password email has been sent'});
        }
      });
    });


  })
}

exports.updatePasswordByEmail = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (err) {
      return next(err)
    }

    if (user) {
      user.password = req.body.password;
      user.resetPasswordExpires = null;
      user.resetPasswordToken = null;
      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).send({ message: 'Password updated' })
      });
    }
    else {
      res.status(404).json({error: 'Change password link has expired'})
    }
  })
}

