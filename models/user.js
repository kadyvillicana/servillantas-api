var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');


var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: String
}, {
    timestamps: true
})


UserSchema.pre('save', function (next) {
    var user = this;
    var SALT_FACTOR = 5;
   
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, function (err, hash) {
            console.log("fdfdd")
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function (passwordAttempt, cb) {
    bcrypt.compare(passwordAttempt, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);