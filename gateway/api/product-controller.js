const moment = require('moment');
const passport = require('passport');

const logger = require("../lib/logger");
const Product = require('../models/product');
const requireAuth = passport.authenticate('jwt', {session: false});
const requireAdmin = require("../lib/admin-middleware");

const productController = apiRouter => {

    apiRouter.put('/product', requireAuth, requireAdmin, function(req, res) {

        req.checkBody('name', 'Invalid name').len(1, 50);

        const errors = req.validationErrors();
        if (errors) {
            res.status(400).json({error: "Validation error !"});
        }
        if (req.body.id) {
            Product.findById(req.body.id, function(err, foundProduct) {
                if (err) {
                    logger.error('product search error : ' + err.message);
                    res.status(500).json({error: "Opppssss !!! There is a problem when searching product!"});
                }
                foundProduct.name = req.body.name;
                foundProduct.save(function(err, updatedProduct) {
                    if (err) {
                        res.status(500).json({error: "Opppssss !!! There is a problem when updating product!"});
                    }
                    logger.info('product updated  : ' + updatedProduct.name);
                    res.json({product: updatedProduct});
                });
            });
        } else {
            const product = {
                name: req.body.name
            };
            Product.create(product, function(err, newProduct) {
                if (err) {
                    logger.error('product create error : ' + err.message);
                    res.status(500).json({error: "Opppssss !!! There is a problem when creating a product!"});
                }
                logger.info('new product created  : ' + newProduct.name);
                res.json({product: newProduct});
            });
        }

    });

    apiRouter.post('/product/:id/price', requireAuth, requireAdmin, function(req, res) {

        req.checkBody('price', 'Invalid price').notEmpty().isNumber();
        const errors = req.validationErrors();
        if (errors || !req.params.id) {
            res.status(400).json({error: "Validation error !"});
        };
        const newPrice = {
            price: req.body.price
        };
        Product.updatePrice(req.params.id, newPrice, function(err, updatedProduct) {
            if (err) {
                logger.error('price update error : ' + err.message);
            }
            logger.info('price updated  for ' + updatedProduct.name + ' new price is ' + req.body.price);
            res.json({product: updatedProduct})
        });
    });

    apiRouter.get('/product/:id/:timespan', function(req, res) {
        if (!req.params.id) {
            res.status(400).json({error: "Validation error !"});
        }
        const productId = req.params.id;
        const timespan = req.params.timespan.toLowerCase();

        const timeSpanTypes={
          'daily':'days',
          'weekly':'weeks',
          'monthly':'months',
          'yearly':'years'
        };
        const previousUTCtime = moment(Date.now()).utc(-1, timeSpanTypes[timespan] || 'days').utc();

        Product.getWithAllPricesAfter(productId, previousUTCtime, function(err, foundProduct) {
            if (err) {
                logger.error('product find error : ' + err.message);
                res.status(500).json({error: "Opppssss !!! There is a problem when creating a product!"});
            }
            res.json({product: foundProduct});
        });

    });

    apiRouter.get('/product',function(req,res){
      Product.getAllWithActivePrice(function(err,foundProducts){
        if(err){
          logger.error('product find error : ' + err.message);
          res.status(500).json({error: "Opppssss !!! There is a problem when creating a product!"});
        }
        res.json({products:foundProducts});
      })
    });
    
}

module.exports = {
    default: productController
}
