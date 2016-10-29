const moment = require('moment');
const passport = require('passport');

const logger = require("../lib/logger");
const User = require('../models/user');
const requireAuth = passport.authenticate('jwt', {session: false});

const userController = apiRouter => {

    apiRouter.put('/user', requireAuth, function(req, res) {

        req.checkBody('name.firstName', 'Invalid first name').len(1, 50);
        req.checkBody('name.lastName', 'Invalid last name').len(1, 50);
        req.checkBody('name.middleName', 'Invalid middle name').len(0, 50);
        req.checkBody('email', 'Invalid email').len(1, 100).isEmail();

        const errors = req.validationErrors();
        if (errors) {
            res.status(400).json({error: "Validation error !"});
        }

        User.findById(req.user.id, function(err, foundUser) {
            if (err) {
                logger.error('user search error : ' + err.message);
                res.status(500).json({error: "Opppssss !!! There is a problem when searching user!"});
            }
            foundUser.name.firstName = req.body.name.firstName;
            foundUser.name.lastName = req.body.name.lastName;
            foundUser.name.middleName = req.body.name.middleName;
            foundUser.email = req.body.email;
            foundUser.addresses = req.body.addresses;

            foundUser.save(function(err, updatedUser) {
                if (err) {
                    logger.error('user updating error : ' + err.message);
                    res.status(500).json({error: "Opppssss !!! There is a problem when updating user!"});
                }
                logger.info('user updated  : ' + updatedUser.email);
                res.json({user: updatedUser});
            });

        });
    });

}

module.exports = {
    default: userController
}
