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
        User.findOneByEmail(email, function(err, user) {
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

    //**************************************
    const jwtOptions = {
      jwtFromRequest:ExtractJWT.fromHeader('authorization'),
      secretOrKey:config.secret
    };
    const jwtLogin = new JWTStrategy(jwtOptions, function(payload, done) {
        User.findById(payload.sub, function(err, user) {
            if (err) {
                done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    });

    passport.use(localLogin);
    passport.use(jwtLogin);

};
