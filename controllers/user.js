const User                    = require('../models/user');
const mail                    = require('../services/mail');
const randomPassword          = require('../helpers/randomPassword');
const { validationResult }    = require('express-validator/check');

exports.registerUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  var email = req.body.email;
  var password = randomPassword(6);
  var organization = req.body.organization;
  var name = req.body.name;
  var lastName = req.body.lastName;
  var role = req.body.role;
  var verified = false;


  User.findOne({ email: email, deleted: false }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(409).send({ error: 'That email address is already in use' });
    }

    var user = new User({
      email: email,
      password: password,
      organization: organization,
      name: name,
      lastName: lastName,
      role: role,
      verified: verified,
      deleted: false,
    });

    user.save(async function (err, user) {
      if (err) {
        return next(err);
      }
      const mailData = {
        "subject": 'Bienvenido al Portal de Administración LGT',
        "text": "Tu usuario del Panel de Aministración de LGT se creó correctamente..\n\n" +
        "Utiliza tu correo electrónico y contraseña incluida en este correo para ingresar al Portal LGT en el siguiente enlace:\n\n"+
        "Panel de administración LGT: "+ process.env.APP_URL+"lgt-admin"+"\n\n"+
        "Tu contraseña es: " + password + "\n\n" +
        "Una vez que ingreses al portal se te pedira cambiar tu contraseña por defecto por una personal\n\n" +
        "Portal de administración\n" +
        "LGT México"
      };
      try {
        var sendMail = await mail(user.email, mailData);
        res.status(200).send({ message: 'User registered successfully, default password email has been sent' });
      }
      catch (err) {
        return next(err)
      }
      res.status(201).json({
        user: user
      })
    });
  });
}

exports.getUsers = (req, res, next) => {
  
  User.find({deleted: false,  _id: { $nin: [res.locals.user.id] } }, ['_id', 'email', 'name', 'lastName', 'role','lastConnection','organization'], { sort: { createdAt: 1 } }, (err, users) => {
    if (err) {
      return next(err);
    }

    if (!users.length) {
      return res.status(200).send({ message: "There are no users", success: false });
    }
    return res.status(200).send({ data: users, success: true });
  });
}

exports.getUser = (req, res, next) => {
  const { _id } = req.params;

  User.findOne({ _id: _id, deleted: false }, async (err, item) => {
    if (err) {
      return next(err);
    }

    if (!item) {
      return res.status(404).send({ message: "User not found" });
    }

    return res.status(200).send({ data: await item, success: true });
  });
}

exports.updateUser = (req, res, next) => {
  const { _id } = req.params;
  const { name, lastName, email, organization, role } = req.body;
  var sendPassword = false;
  var newPassword = ''

  User.findOne({ _id: _id }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (user) {
      if (user.email != email) {
        user.password = randomPassword(6);
        user.verified = false;
        newPassword = user.password;
        sendPassword = true;
      }

      user.name = name;
      user.lastName = lastName;
      user.email = email;
      user.organization = organization;
      user.role = role;

      user.save(async (err) => {
        if (err) {
          return next(err);
        }
        if (sendPassword) {
          const mailData = {
            "subject": 'Bienvenido al Portal de Administración LGT',
            "text": "Tu usuario del Panel de Aministración de LGT se editó correctamente..\n\n" +
              "Utiliza tu correo electrónico y contraseña incluida en este correo para ingresar al Portal LGT en el siguiente enlace:\n\n"+
              "Panel de administración LGT: "+ process.env.APP_URL+"lgt-admin"+"\n\n"+
              "Tu contraseña es: " + newPassword + "\n\n" +
              "Una vez que ingreses al portal se te pedira cambiar tu contraseña por defecto por una personal\n\n" +
              "Portal de administración\n" +
              "LGT México"
          };
          try {
            var sendMail = await mail(user.email, mailData);
            res.status(200).send({ message: 'User updated, email with new password has been sent', success: true });
          }
          catch (err) {
            return next(err)
          }
        }
        res.status(200).send({ message: "User updated", success: true })
      })
    }
  });
}

exports.deleteUser = (req, res,next) => {
  User.findOneAndUpdate({ _id: req.params._id }, { $set: { deleted: true } }, (err, user) => {
    if (err) {
      return next(err);
    }
    return res.status(200).send({ data: user, success: true });
  });
}