module.exports = function(req, res, next) {
    if (req.body && req.body.user && req.body.user.admin) {
        next();
    }
    res.status(401).json({error: "UnAuthorized access"});
};
