const moment = require('moment');
const passport = require('passport');

const User = require('../models/user');
const requireAuth = passport.authenticate('jwt', {session: false});

const userController = apiRouter => {

    apiRouter.get('/add/:first/:second',requireAuth ,function(req, res) {
        // convert the two values to floats and add them together
        var sum = parseFloat(req.params.first) + parseFloat(req.params.second);
        res.send(200, String(sum));
    });

}

module.exports = {
    default: userController
}
