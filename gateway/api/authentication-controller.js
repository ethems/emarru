const moment = require('moment');
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jwt-simple');

const logger = require("../lib/logger");

const requireSignin = passport.authenticate('local', {session: false});

const createToken = (user, config) => {
    const timeStamp = Date.now();
    return jwt.encode({
        sub: user.id,
        iat: timeStamp
    }, config.secret);
};

const AuthenticationController = (apiRouter, config) => {

    apiRouter.post('/signup', function(req, res) {
        req.checkBody('email', 'Invalid email').len(1, 100).isEmail();
        req.checkBody('password', 'Invalid password').len(5, 50);
        req.checkBody('name.firstName', 'Invalid first name').len(1, 50);
        req.checkBody('name.lastName', 'Invalid last name').len(1, 50);
        req.checkBody('name.middleName', 'Invalid middle name').len(0, 50);

        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({error: "Validation error !"})
        }
        var newUser = {
            name: {
                firstName: req.body.name.firstName,
                middleName: req.body.name.middleName,
                lastName: req.body.name.lastName
            },
            email: req.body.email
        };

        User.findOneByEmail(req.body.email, function(err, existingUser) {
            if (err) {
                logger.error('error : ' + err.message);
                return res.status(500).json({error: "Opppssss !!! There is an internal server error!"});
            }
            if (existingUser) {
                return res.status(409).json({error: "existed user !"});
            } else {
                User.hashPassword(req.body.password, function(err, passwordHash) {
                    if (err) {
                        logger.error('password hash error : ' + err.message);
                        return res.status(500).json({error: "Opppssss !!! There is a problem when hashing password!"});
                    }
                    newUser.passwordHash = passwordHash;
                    User.create(newUser, function(err, createdUser) {
                        if (err) {
                            logger.error('user create error : ' + err.message);
                            return res.status(500).json({error: "Opppssss !!! There is a problem when creating a new user!"});
                        }
                        logger.info('new user created  : ' + createdUser.email);
                        return res.json({
                            user: createdUser,
                            token: createToken(createdUser, config)
                        });
                    });
                });

            }

        });

    });
    apiRouter.post('/signin', requireSignin, function(req, res) {
        return res.json({
            user: req.user,
            token: createToken(req.user, config)
        });
    });

}

module.exports = {
    default: AuthenticationController
}
