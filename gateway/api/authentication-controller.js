const moment = require('moment');
const User = require('../models/user');

var logger = require("../lib/logger");

const AuthenticationController = apiRouter => {

    apiRouter.post('/signup', function(req, res) {
        req.checkBody('email', 'Invalid email').len(1, 100).isEmail();
        req.checkBody('password', 'Invalid password').len(5, 50);
        req.checkBody('name.firstName', 'Invalid first name').len(1, 50);
        req.checkBody('name.lastName', 'Invalid last name').len(1, 50);
        req.checkBody('name.middleName', 'Invalid middle name').len(0,50);

        var errors = req.validationErrors();
        if (errors) {
            res.status(400).json({error: "Validation error !"})
        }
        var newUser = {
            name: {
                firstName: req.body.name.firstName,
                middleName: req.body.name.middleName,
                lastName: req.body.name.lastName
            },
            email: req.body.email
        };

        User.findOne({
            email: req.body.email.toLowerCase()
        }, function(err, existingUser) {
            if (err) {
                logger.error('error : ' + err.message);
                res.status(500).json({error: "Opppssss !!! There is an internal server error!"});
            }
            if (existingUser) {
                res.status(409).json({error: "existed user !"});
            } else {
                User.hashPassword(req.body.password, function(err, passwordHash) {
                    if (err) {
                        logger.error('password hash error : ' + err.message);
                        res.status(500).json({error: "Opppssss !!! There is a problem when hashing password!"});
                    }
                    newUser.passwordHash = passwordHash;
                    User.create(newUser, function(err, createdUser) {
                        if (err) {
                            logger.error('user create error : ' + err.message);
                            res.status(500).json({error: "Opppssss !!! There is a problem when creating a new user!"});
                        }
                        logger.info('new user created  : ' + createdUser.email);
                        res.json(createdUser);
                    });
                });

            }

        });

    });

}

module.exports = {
    default: AuthenticationController
}
