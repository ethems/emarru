var moment = require('moment');

const User = require('../models/user');

const userController = apiRouter => {

    apiRouter.get('/add/:first/:second', function(req, res) {
        // convert the two values to floats and add them together
        var sum = parseFloat(req.params.first) + parseFloat(req.params.second);
        res.send(200, String(sum));
    });

}

module.exports = {
    default: userController
}
