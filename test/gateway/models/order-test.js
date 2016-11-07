'use strict';

var should = require('should');
var Product = require('../../../gateway/models/product');
var User = require('../../../gateway/models/user');
var Order = require('../../../gateway/models/order');
var OrderItem = require('../../../gateway/models/order-item');


describe('Order: models', function() {
    var agaveID = 0;
    before(function(done) {
        var p = {
            name: "Agave"
        };
        Product.create(p, function(err, createdProduct) {
            Product.updatePrice(createdProduct.id, {
                price: 30.34,
                startDate: new Date(1999, 1, 1)
            }, function(err, updatedProduct) {
                Product.updatePrice(createdProduct.id, {
                    price: 30.30,
                    startDate: new Date(2001, 1, 1)
                }, function(err, updatedProduct) {
                    Product.updatePrice(createdProduct.id, {
                        price: 30.28,
                        startDate: new Date(2015, 1, 1)
                    }, function(err, updatedProduct) {
                        Product.updatePrice(createdProduct.id, {
                            price: 30.35,
                            startDate: new Date(2016, 1, 1)
                        }, function(err, updatedProduct) {
                            agaveID = updatedProduct.id;
                            done();
                        });
                    });
                });
            });
        });
    });
    after(function() {});
    describe('#Create', function() {
        it('should create a new Order', function(done) {
            User.findOne({
                'email': 'enduser@enduser.com'
            }, function(err, foundUser) {
                should.not.exist(err);
                var o = {
                    user: foundUser.id,
                    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                    address: {
                        streetLine1: "st1",
                        city: "c1",
                        zip: "z1"
                    }
                };
                Order.create(o, function(err, createdOrder) {
                    should.not.exist(err);
                    should.exist(createdOrder);
                    done();
                });
            });
        });
        it('should create a new Order with OrderItem', function(done) {
            Product.getWithActivePrice(agaveID, function(err, foundProduct) {
                should.not.exist(err);
                should.exist(foundProduct);
                var orderItem = {
                    product: foundProduct.id,
                    price: foundProduct.priceHistory[0].id,
                    quantity: 1
                };
                OrderItem.create(orderItem, function(err, createdOrderItem) {
                    should.not.exist(err);
                    should.exist(createdOrderItem);
                    User.findOne({
                        'email': 'enduser@enduser.com'
                    }, function(err, foundUser) {
                        should.not.exist(err);
                        var o = {
                            user: foundUser.id,
                            note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                            address: {
                                streetLine1: "st1",
                                city: "c1",
                                zip: "z1"
                            },
                            orderItems: [createdOrderItem.id]
                        };
                        Order.create(o, function(err, createdOrder) {
                            should.not.exist(err);
                            should.exist(createdOrder);
                            done();
                        });
                    });
                });
            });
        });

    });
    describe('#Find', function() {
        it('should find Order', function(done) {
            User.findOne({
                'email': 'enduser@enduser.com'
            }, function(err, foundUser) {
                should.not.exist(err);
                should.exist(foundUser);
                Order.getAllByUserId(foundUser.id, function(err, foundOrderList) {
                    should.not.exist(err);
                    foundOrderList.length.should.equal(2);
                    done();
                });

            });
        });
    });
});
