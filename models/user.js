const mongoose   = require('mongoose');
const bcryptjs   = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const ERRORS     = require('../constants/errors');


var UserSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  password: String,
  organization: String,
  role: String,
  verified: Boolean,
  lastConnection: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

UserSchema.path('email').validate(async function (value) {
  const user = await mongoose.model('User', UserSchema)
    .findOne({ email: value, deleted: false })
    .collation({ locale: 'es', strength: 1 });
  if (user && user._id.toString() !== this._id.toString()) {
    return false;
  }
  return true;
}, ERRORS.DUPLICATE_EMAIL);

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
  }, process.env.PASSPORT_SECRET);
}

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    lastName: this.lastName,
    organization: this.organization,
    role: this.role,
    verified: this.verified,
    lastConnection: this.lastConnection,
  };
};

module.exports = mongoose.model('User', UserSchema);