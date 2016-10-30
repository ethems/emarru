'use strict';

var utils = require('../../utils');
var should = require('should');
var Product = require('../../../gateway/models/product');
var Price = require('../../../gateway/models/price');


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
            };
            Product.create(p, function(err, createdProduct) {
                Product.updatePrice(createdProduct._id,{price:10.34},function(err,newProduct){
                  should.not.exist(err);
                  newProduct.name.should.equal('Domates Biber Patlican');
                  newProduct.priceHistory.length.should.equal(1);
                  newProduct.priceHistory[0].price.should.equal(10.34);

                  done();
                })
            });
        });

    });
    describe('#Find', function() {
      it('should filter productHistory by date', function(done) {
        var p = {
            name: "Biber Domates Patlican",
        };
            Product.create(p,function(err,createdProduct){
              should.not.exist(err);
              should.exist(createdProduct);
              Product.updatePrice(createdProduct.id,{price:30.34,startDate:new Date(1999,1,1)},function(err,updatedProduct){
                should.not.exist(err);
                Product.updatePrice(createdProduct.id,{price:30.30,startDate:new Date(2001,1,1)},function(err,updatedProduct){
                  should.not.exist(err);
                  Product.updatePrice(createdProduct.id,{price:30.28,startDate:new Date(2015,1,1)},function(err,updatedProduct){
                    should.not.exist(err);
                    Product.updatePrice(createdProduct.id,{price:30.35,startDate:new Date(2017,1,1)},function(err,updatedProduct){
                      should.not.exist(err);
                      Product.getWithAllPricesSince(createdProduct.id,new Date(),function(err,foundProduct){
                        foundProduct.priceHistory[0].price.should.equal(30.35);
                        foundProduct.priceHistory.length.should.equal(1);
                        done();
                      })
                    })
                  })
                })
              })
            })
      });

    });
    describe("#Update", function() {
        it('should update productHistory', function(done) {

            Product.findByName('avokado',function(err,foundProduct){
              should.not.exist(err);
              should.exist(foundProduct);
              Product.updatePrice(foundProduct.id,{price:30.34},function(err,updatedProduct){
                should.not.exist(err);
                Product.updatePrice(foundProduct.id,{price:30.30},function(err,updatedProduct){
                  should.not.exist(err);
                  Product.updatePrice(foundProduct.id,{price:30.28},function(err,updatedProduct){
                    should.not.exist(err);
                    Product.updatePrice(foundProduct.id,{price:30.35},function(err,updatedProduct){
                      should.not.exist(err);
                      updatedProduct.priceHistory[0].price.should.equal(30.35);
                      updatedProduct.priceHistory.length.should.equal(1);
                      done();
                    })
                  })
                })
              })
            });
        });

        it('should add new price to productHistory', function(done) {
            var p = {
                name: "Domates biber patlican sogan 2",
                priceHistory:[]
            };
            Product.create(p, function(err, createdProduct) {
                Product.updatePrice(createdProduct._id, {
                    price: 10.35
                }, function(err, updatedProduct) {
                    should.not.exist(err);
                    updatedProduct.priceHistory.length.should.equal(1);
                    updatedProduct.priceHistory[0].price.should.equal(10.35);
                    done();
                })
            });
        });

    });

});
