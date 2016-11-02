'use strict';
const moment = require('moment');
var utils = require('../../utils');
var should = require('should');
var User = require('../../../gateway/models/user');
var Product = require('../../../gateway/models/product');
var Price = require('../../../gateway/models/price');
var ShoppingCart = require('../../../gateway/models/shopping-cart');
var ShoppingCartItem = require('../../../gateway/models/shopping-cart-item');


describe('Shopping cart', function() {
    describe('#Create', function() {
        it('should create a new Shopping Cart with empty array' , function(done) {
            User.findOne({
                'email': 'enduser@enduser.com'
            }, function(err, foundUser) {
                should.not.exist(err);
                Product.findByName('avokado', function(err, foundProduct) {
                    should.not.exist(err);
                    ShoppingCart.findOne({
                        'user': foundUser.id
                    }, function(err, shoppingCart) {
                        should.not.exist(err);
                        should.not.exist(shoppingCart);
                        ShoppingCart.create({
                            user: foundUser.id,
                            shoppingCartItems: []
                        }, function(err, newShoppingCart) {
                            should.not.exist(err);
                            should.exist(newShoppingCart);
                            done();
                        });
                    });
                });

            });
        });
        it('should create a new Shooping Cart with product inside', function(done){
          User.findOne({'email': 'enduser@enduser.com'}, function(err, foundUser){
            should.not.exist(err);
            Product.findByName('avokado', function(err, foundProduct) {
              should.not.exist(err);
              ShoppingCart.findOne({
                  'user': foundUser.id
              }, function(err, shoppingCart) {
                should.not.exist(err);
                should.exist(shoppingCart);
                shoppingCart.shoppingCartItems.push({
                  product:foundProduct.id
                });
                shoppingCart.save(function(err,savedShoopingCart){
                  should.not.exist(err);
                  should.exist(savedShoopingCart);
                  savedShoopingCart.shoppingCartItems.length.should.equal(1);
                  done();
                });
              });
            });
          });
        });
    });
    describe('#Find',function(){
      it('should find Shooping Cart with products inside', function(done){
        User.findOne({'email': 'enduser@enduser.com'}, function(err, foundUser){
          ShoppingCart.findOne({
              'user': foundUser.id
          }).populate({path:'shoppingCartItems.product',populate:{path:'priceHistory',model:'Price',match:{active:true}}})
          .exec(function(err,foundShoppingCart){
            should.not.exist(err);
            should.exist(foundShoppingCart);
            foundShoppingCart.shoppingCartItems[0].product.name.should.equal('Avokado');
            foundShoppingCart.shoppingCartItems[0].product.priceHistory.length.should.equal(1);
            foundShoppingCart.shoppingCartItems[0].product.priceHistory[0].price.should.equal(30.35);
              done();
          });
        });
      });
      it('should find Shopping Cart with product for second', function(done){
        User.findOne({'email': 'enduser@enduser.com'}, function(err, foundUser){
          ShoppingCart.findOne({
              'user': foundUser.id,
              'shoppingCartItems':{
                $elemMatch:{createdDate: {$gte: moment().startOf('second')}}
              }
          }).populate({path:'shoppingCartItems.product',populate:{path:'priceHistory',model:'Price',match:{active:true}}})
          .exec(function(err,foundShoppingCart){
            should.not.exist(err);
            should.not.exist(foundShoppingCart);
              done();
          });
        });
      });

    });
    
    describe('#Delete', function(){
      it('should Delete Shopping cart', function(done){
        User.findOne({'email': 'enduser@enduser.com'}, function(err, foundUser){
          ShoppingCart.findOne({
              'user': foundUser.id
          }).exec(function(err,foundShoppingCart){
            should.not.exist(err);
            should.exist(foundShoppingCart);
            foundShoppingCart.shoppingCartItems.length.should.equal(1);
            foundShoppingCart.shoppingCartItems=[];
            foundShoppingCart.save(function(err, deletedShoppingCart){
              should.not.exist(err);
              deletedShoppingCart.shoppingCartItems.length.should.equal(0);
              done();
            });
          });
        });
      });
    });


});
