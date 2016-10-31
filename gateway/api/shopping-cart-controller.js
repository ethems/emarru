const moment = require('moment');
const passport = require('passport');

const logger = require("../lib/logger");
const User = require('../models/user');

const requireAuth = passport.authenticate('jwt', {session: false});

const shoppingCartController = apiRouter => {

    apiRouter.post('/shopping_cart',requireAuth,function(req,res){
      //Create brand new shopping cart item
    });
    apiRouter.put('/shopping_cart/:id',requireAuth,function(req,res){
      //Update shopping cart item
    });
    apiRouter.delete('/shopping_cart/:id',requireAuth,function(req,res){
      //Delete shopping cart item
    });
    apiRouter.put('/shopping_cart', requireAuth, function(req, res) {
      //Update all shopping cart item
    });
    apiRouter.get('/shopping_cart',requireAuth, function(req,res){
      //Read All shooping cart item
    })
}

module.exports = {
    default: shoppingCartController
}
