module.exports = (apiRouter,config) => {
    require('./user-controller').default(apiRouter);
    require('./authentication-controller').default(apiRouter,config);
    require('./product-controller').default(apiRouter,config);
    require('./shopping-cart-controller').default(apiRouter,config);
}
