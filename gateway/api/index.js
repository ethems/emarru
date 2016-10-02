module.exports = apiRouter => {
    require('./user-controller').default(apiRouter);
    require('./authentication-controller').default(apiRouter);
}
