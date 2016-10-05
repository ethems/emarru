const passport = require('passport');
const User = require('../models/user');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

module.exports = config => {

    const localOptions = {
        usernameField: 'email'
    };
    const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
        User.findOne({
            email: email.toLowerCase()
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }

            User.comparePasswordAndHash(password, user.passwordHash, function(err, areEqual) {
                if (err) {
                    return done(err);
                }
                if (!areEqual) {
                    return done(null, false);
                }
                return done(null, user);
            });
        });
    });

    passport.use(localLogin);

};
