'use strict';

const express = require('express');
var request = require('supertest');
var should = require('should');
var Product = require('../../../gateway/models/product');
var Price = require('../../../gateway/models/price');
var request = request('http://localhost:3000');

describe('Product Controller', function() {
    var mantarID=0;
    before(function(done) {
      var p = {
          name: "Mantar"
      };
      Product.create(p,function(err,createdProduct){
        Product.updatePrice(createdProduct.id,{price:30.34,startDate:new Date(1999,1,1)},function(err,updatedProduct){
          Product.updatePrice(createdProduct.id,{price:30.30,startDate:new Date(2001,1,1)},function(err,updatedProduct){
            Product.updatePrice(createdProduct.id,{price:30.28,startDate:new Date(2015,1,1)},function(err,updatedProduct){
              Product.updatePrice(createdProduct.id,{price:30.35,startDate:new Date(2016,1,1)},function(err,updatedProduct){
                mantarID=updatedProduct.id;
                done();
              })
            })
          })
        })
      })
    });
    after(function(){

    });
    describe('POST', function() {
        it('should get 401 unauthentication code if there is no token', function(done) {
            const p = {
                name: "1"
            };
            request.put('/api/products').send(p).set('Accept', 'application/json').expect(401).end(function(err, res) {
                should.not.exist(err);
                done();
            });
        });
    });

    describe('GET', function() {
        it('should get product with correct timespan', function(done) {
            request.get(`/api/products/${mantarID}/days`).set('Accept', 'application/json').expect(200).end(function(err, res) {
                should.not.exist(err);
                res.body.product.priceHistory.length.should.equal(1);
                done();
            });
        });

        it('should get products with active price', function(done) {
            request.get(`/api/products`).set('Accept', 'application/json').expect(200).end(function(err, res) {
                should.not.exist(err);
                res.body.products.length.should.greaterThan(1);
                var mantar=res.body.products.filter(function(obj){
                  return obj.name=="Mantar"
                })[0];
                mantar.priceHistory.length.should.equal(1);
                mantar.priceHistory[0].price.should.equal(30.35);
                done();
            });
        });
        it('should get product with active price', function(done) {
            request.get(`/api/products/${mantarID}`).set('Accept', 'application/json').expect(200).end(function(err, res) {
                should.not.exist(err);
                var mantar=res.body.product;
                mantar.priceHistory.length.should.equal(1);
                mantar.priceHistory[0].price.should.equal(30.35);
                done();
            });
        });

    });

})
