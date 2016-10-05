module.exports = (apiRouter,config) => {
    require('./user-controller').default(apiRouter);
    require('./authentication-controller').default(apiRouter,config);
}
