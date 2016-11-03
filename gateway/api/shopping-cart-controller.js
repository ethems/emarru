const moment = require('moment');
const passport = require('passport');
const _ = require('lodash');
const logger = require("../lib/logger");
const User = require('../models/user');
const ShoppingCart = require('../models/shopping-cart');

const requireAuth = passport.authenticate('jwt', {session: false});

const shoppingCartController = apiRouter => {
    // Because Shopping cart items is value , their ids are not important ,
    // just use addition or modification for CUD operations
    apiRouter.post('/shopping_cart', requireAuth, function(req, res) {
        // Validation
        req.checkBody('productId', 'Invalid productId').len(1, 50);
        const errors = req.validationErrors();
        if (errors) {
            logger.error('Shopping cart validation error');
            return res.sendStatus(400);
        }
        const shoppingCartItem = {
            product: req.body.productId
        };

        ShoppingCart.findOne({
            'user': req.user.id
        }, function(err, shoppingCart) {
            if (shoppingCart) {
                if (!_.find(shoppingCart.shoppingCartItems, function(item) {
                    return item.product == req.body.productId
                })) {
                    //Add new item to existed shoppingCart
                    shoppingCart.shoppingCartItems.push(shoppingCartItem);
                    shoppingCart.save(function(err, savedShoppingCart) {
                        if (err) {
                            logger.error('Shopping cart save error : ' + err.message);
                            return res.status(500).json({error: "Shopping cart save error"});
                        }
                        return res.sendStatus(200);
                    });
                } else {
                    // there is already product in the list
                    return res.sendStatus(409);
                }

            } else {
                //create brand new shopping cart
                ShoppingCart.create({
                    user: req.user.id,
                    shoppingCartItems: [shoppingCartItem]
                }, function(err, newShoppingCart) {
                    if (err) {
                        logger.error('Shopping cart create error : ' + err.message);
                        return res.status(500).json({error: "Shopping cart creation error"});
                    }
                    return res.sendStatus(200);
                });
            }
        });
    });
    apiRouter.put('/shopping_cart', requireAuth, function(req, res) {
        //Update all shopping cart item
        var updatingShoppingCartItems = req.body.shoppingCartItems;
        if (!Array.isArray(updatingShoppingCartItems)) {
            logger.error('Shopping cart validation error');
            return res.status(400).json({error: "Validation error !"});
        }
        ShoppingCart.findOne({
            'user': req.user.id
        }, function(err, shoppingCart) {
            shoppingCart.shoppingCartItems = updatingShoppingCartItems;
            shoppingCart.save(function(err, savedShoppingCart) {
                if (err) {
                    logger.error('Shopping cart update error : ' + err.message);
                    return res.status(500).json({error: "Shopping cart update error"});
                }
                return res.sendStatus(200);
            })
        });
    });
    apiRouter.get('/shopping_cart', requireAuth, function(req, res) {
        //Read All shooping cart item
        ShoppingCart.FindByUserId(req.user.id, function(err, foundShoppingCart) {
            if (err) {
                logger.error('Shopping cart create error : ' + err.message);
                return res.status(500).json({error: "Shopping cart search error"});
            }
            return res.json({shoppingCart: foundShoppingCart});
        });
    })
}

module.exports = {
    default: shoppingCartController
}
