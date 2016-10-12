const moment = require('moment');
const passport = require('passport');

const logger = require("../lib/logger");
const Product = require('../models/product');
const requireAuth = passport.authenticate('jwt', {session: false});

const productController = apiRouter => {

    apiRouter.post('/product', requireAuth, function(req, res) {

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
                name: req.body.name,
                priceHistory: [
                    {
                        price: 0
                    }
                ]
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

}

module.exports = {
    default: productController
}
