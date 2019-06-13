const mongoose   = require('mongoose');
const bcryptjs   = require('bcryptjs');
const jwt        = require('jsonwebtoken');


var UserSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: String,
  organization: String,
  role: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});


UserSchema.pre('save', function (next) {
  var user = this;
  var SALT_FACTOR = 12;

  if (!user.isModified('password')) {
    return next();
  }

  bcryptjs.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }
    bcryptjs.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    lastName: this.lastName,
    role: this.role,
    avatar: this.avatar
  };
};

module.exports = mongoose.model('User', UserSchema);