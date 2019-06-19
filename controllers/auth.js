const User                    = require('../models/user');
const passport                = require('passport');
const { validationResult }    = require('express-validator/check');
const crypto                  = require('crypto');
const mail                    = require('../services/mail');

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
      const token = passportUser.generateJWT();
      User.findOneAndUpdate({ email: user.email }, { $set: { lastConnection: Date.now() } }, (err) => {
        if (err) {
          return next(err);
        }
      });
      return res.json({ user: user.toAuthJSON(), token });
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
      return res.status(404).json({ error: "Email not found" })
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.updateOne({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    }, async (err) => {
      if (err) {
        return next(err)
      }

      const mailData = {
        subject: 'Recuperación de contraseña de Portal de Administración LGT',
        text: "Hola\n\n" +
          "Se ha solicitado una nueva contraseña. Para realizar el cambio de la contraseña haz clic en el siguiente enlace.\n\n" +
          process.env.APP_URL + "recover-password/" + token + "\n\n" +
          "Si no solicitaste restablecer la contraseña, haz caso omiso de este correo electrónico.\n\n" +
          "Portal de administración\n" +
          "LGT México"
      };

      try {
        var sendMail = await mail(user.email, mailData);
        res.status(200).send({ message: 'Recover Password email has been sent' });
      }
      catch (err) {
        next(err)
      }
    });
  })
}

exports.updatePasswordByEmail = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      user.password = req.body.password;
      user.resetPasswordExpires = null;
      user.resetPasswordToken = null;
      user.verified = true;
      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.status(200).send({ message: 'Password updated' });
      });
    }
    else {
      res.status(404).json({ error: 'Change password link has expired' });
    }
  })
}

