var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authConfig = require('../config/auth');

function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: "1d"
    });
}

function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        role: request.role
    };
}

exports.register = function(req, res, next){
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
            var userInfo = setUserInfo(user);
            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })
        });

    });

}