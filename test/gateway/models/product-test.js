'use strict';

// import the moongoose helper utilities
var utils = require('../../utils');
var should = require('should');
// import our User mongoose model
var Product = require('../../../gateway/models/product');

describe('Products: models', function() {
    describe('#Create', function() {
        it('should create a new Product', function(done) {
            var p = {
                name: "domates"
            };
            Product.create(p, function(err, createdProduct) {
                should.not.exist(err);
                createdProduct.name.should.equal('Domates');
                done();
            });
        });

        it('should create a new Product with captilze name if name contains more than one word', function(done) {
            var p = {
                name: "Domates patlican"
            };
            Product.create(p, function(err, createdProduct) {
                should.not.exist(err);
                createdProduct.name.should.equal('Domates Patlican');
                done();
            });
        });

        it('should create a new Product with price', function(done) {
            var p = {
                name: "Domates biber patlican",
                priceHistory: [
                    {
                        price: 10.34
                    }
                ]
            };
            Product.create(p, function(err, createdProduct) {
                should.not.exist(err);
                createdProduct.name.should.equal('Domates Biber Patlican');
                createdProduct.priceHistory[0].price.should.equal(10.34);

                done();
            });
        });

    });
    describe('#Find', function() {});
    describe("#Update", function() {
        it('should update productHistory', function(done) {
            var p = {
                name: "Domates biber patlican sogan",
                priceHistory: [
                    {
                        price: 10.34
                    }, {
                        price: 10.31
                    }, {
                        price: 10.30
                    }
                ]
            };
            Product.create(p, function(err, createdProduct) {
                Product.updatePrice(createdProduct._id, {
                    price: 10.35
                }, function(err, doc) {
                    should.not.exist(err);
                    done();
                })
            });
        });

        it('should add new price to productHistory', function(done) {
            var p = {
                name: "Domates biber patlican sogan 2"
            };
            Product.create(p, function(err, createdProduct) {
                Product.updatePrice(createdProduct._id, {
                    price: 10.35
                }, function(err, updatedProduct) {
                    should.not.exist(err);
                    updatedProduct.priceHistory[0].price.should.equal(10.35);
                    done();
                })
            });
        });

    });

});
