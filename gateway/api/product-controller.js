"use strict";

const moment = require('moment');
const passport = require('passport');

const logger = require("../lib/logger");
const Product = require('../models/product');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireAdmin = require("../lib/admin-middleware");

const productController = apiRouter => {

    apiRouter.put('/products', requireAuth, requireAdmin, function(req, res) {
        // Rightnow just allow changing name
        req.checkBody('name', 'Invalid name').len(1, 50);

        const errors = req.validationErrors();
        if (errors) {
            logger.error('Product validation error');
            return res.status(400).json({error: "Validation error !"});
        }
        if (req.body.id) {
            Product.findById(req.body.id, function(err, foundProduct) {
                if (err) {
                    logger.error('Product search error : ' + err.message);
                    return res.status(500).json({error: "Product seach error"});
                }
                foundProduct.name = req.body.name;
                foundProduct.save(function(err, updatedProduct) {
                    if (err) {
                        logger.error('Product update error : ' + err.message);
                        return res.status(500).json({error: "Product update error"});
                    }
                    logger.info('product updated  : ' + JSON.stringify(updatedProduct));
                    return res.json({product: updatedProduct});
                });
            });
        } else {
            const product = {
                name: req.body.name
            };
            Product.create(product, function(err, newProduct) {
                if (err) {
                    logger.error('product create error : ' + err.message);
                    return res.status(500).json({error: "Product create error"});
                }
                logger.info('new product created  : ' + JSON.stringify(newProduct));
                return res.json({product: newProduct});
            });
        }

    });

    apiRouter.post('/products/:id/price', requireAuth, requireAdmin, function(req, res) {

        req.checkBody('price', 'Invalid price').notEmpty().isNumber();
        const errors = req.validationErrors();
        if (errors || !req.params.id) {
            logger.error('Price validation error');
            return res.status(400).json({error: "Validation error !"});
        }
        const newPrice = {
            price: req.body.price
        };
        Product.updatePrice(req.params.id, newPrice, function(err, updatedProduct) {
            if (err) {
                logger.error('price update error : ' + err.message);
                return res.status(500).json({error: "Price update error"});
            }
            logger.info('price updated  for ' + updatedProduct.name + ' new price is ' + req.body.price);
            return res.json({product: updatedProduct});
        });
    });

    apiRouter.get('/products/:id/:timespan', function(req, res) {
        if (!req.params.id) {
            return res.status(400).json({error: "Validation error !"});
        }
        const productId = req.params.id;
        const timespan = req.params.timespan.toLowerCase();
        const timeSpanTypes = {
            'daily': 'day',
            'weekly': 'week',
            'monthly': 'month',
            'yearly': 'year'
        };
        const sinceTime = moment().startOf(timeSpanTypes[timespan] || 'day');

        Product.getWithAllPricesSince(productId, sinceTime, function(err, foundProduct) {
            if (err) {
                logger.error('product find error : ' + err.message);
                return res.status(500).json({error: "Product find error"});
            }
            return res.json({product: foundProduct});
        });

    });

    apiRouter.get('/products', function(req, res) {
        Product.getAllWithActivePrice(function(err, foundProducts) {
            if (err) {
                logger.error('products find error : ' + err.message);
                return res.status(500).json({error: "Products find error"});
            }
            return res.json({products: foundProducts});
        });
    });

    apiRouter.get('/products/:id', function(req, res) {
        if (!req.params.id) {
            return res.status(400).json({error: "Validation error !"});
        }
        Product.getWithActivePrice(req.params.id, function(err, foundProduct) {
            if (err) {
                logger.error('products find error : ' + err.message);
                return res.status(500).json({error: "Product find error"});
            }
            return res.json({product: foundProduct});
        });
    });

};

module.exports = {
    default: productController
};
