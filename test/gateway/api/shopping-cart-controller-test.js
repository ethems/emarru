'use strict';

var request = require('supertest');
var should = require('should');
var Product = require('../../../gateway/models/product');

var requestApi = request('http://localhost:3000');

describe('ShoppingCart Controller', function() {
    var kavunID = 0;
    before(function(done) {
        var p = {
            name: "Kavun"
        };
        Product.create(p, function(err, createdProduct) {
            Product.updatePrice(createdProduct.id, {
                price: 30.34,
                startDate: new Date(1999, 1, 1)
            }, function() {
                Product.updatePrice(createdProduct.id, {
                    price: 30.30,
                    startDate: new Date(2001, 1, 1)
                }, function() {
                    Product.updatePrice(createdProduct.id, {
                        price: 30.28,
                        startDate: new Date(2015, 1, 1)
                    }, function() {
                        Product.updatePrice(createdProduct.id, {
                            price: 30.35,
                            startDate: new Date(2016, 1, 1)
                        }, function(err, updatedProduct) {
                            kavunID = updatedProduct.id;
                            done();
                        });
                    });
                });
            });
        });
    });
    after(function() {});
    describe('POST', function() {
        it('should get 401 if there is no autorization', function(done) {
            requestApi.post('/api/shopping_cart').set('Accept', 'application/json').expect(401).end(function(err) {
                should.not.exist(err);
                done();
            });
        });
        it('should get 400 there is no productId', function(done) {
            var u = {
                email: "enduser@enduser.com",
                password: "enduser"
            };
            requestApi.post('/api/signin').send(u).end(function(err, res) {
                requestApi.post('/api/shopping_cart').set('authorization', res.body.token).set('Accept', 'application/json').expect(400).end(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
        });
        it('should get 200 there first  productId', function(done) {
            var u = {
                email: "admin@admin.com",
                password: "admin"
            };
            var p = {
                productId: kavunID
            };
            requestApi.post('/api/signin').send(u).end(function(err, res) {
                requestApi.post('/api/shopping_cart').set('authorization', res.body.token).set('Accept', 'application/json').send(p).expect(200).end(function(err) {
                    should.not.exist(err);
                    done();
                });
            });
        });
        it('should get 409 there dublicate productId', function(done) {
            var u = {
                email: "admin@admin.com",
                password: "admin"
            };
            var p = {
                productId: kavunID
            };

            requestApi.post('/api/signin').send(u).end(function(err, res) {
                var token = res.body.token;
                requestApi.post('/api/shopping_cart').set('authorization', token).set('Accept', 'application/json').send(p).expect(409).end(function(err) {
                    should.not.exist(err);
                    requestApi.post('/api/shopping_cart').set('authorization', token).set('Accept', 'application/json').send(p).expect(409).end(function(err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });
        });
    });
    describe('GET', function() {
        it('should get 200 for GET list', function(done) {
            var u = {
                email: "admin@admin.com",
                password: "admin"
            };
            requestApi.post('/api/signin').send(u).end(function(err, res) {
                var token = res.body.token;
                requestApi.get('/api/shopping_cart').set('authorization', token).set('Accept', 'application/json').expect(200).end(function(err, res) {
                    should.not.exist(err);
                    res.body.shoppingCart.shoppingCartItems[0].product.name.should.equal('Kavun');
                    res.body.shoppingCart.shoppingCartItems[0].quantity.should.equal(1);
                    done();
                });
            });
        });
    });
    describe('PUT', function() {

        it('should get 200 for update', function(done) {
            var u = {
                email: "admin@admin.com",
                password: "admin"
            };
            requestApi.post('/api/signin').send(u).end(function(err, res) {
                var token = res.body.token;
                requestApi.get('/api/shopping_cart').set('authorization', token).set('Accept', 'application/json').expect(200).end(function(err, res) {
                    should.not.exist(err);
                    let shoppingCartItems = res.body.shoppingCart.shoppingCartItems;
                    shoppingCartItems[0].quantity = 3;
                    var pL={
                      shoppingCartItems:shoppingCartItems
                    };
                    requestApi.put('/api/shopping_cart').set('authorization', token).set('Accept', 'application/json').send(pL).expect(200).end(function() {
                        done();
                    });
                });
            });
        });

    });
});
