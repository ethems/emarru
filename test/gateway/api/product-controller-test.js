'use strict';

const express = require('express');
var request = require('supertest');
var should = require('should');

var request = request('http://localhost:3000');

describe('Product Controller', function() {
    describe('POST/product', function() {
        it('should get 401 unauthentication code if there is no token', function(done) {
            const p={
              name:"1"
            };
            request.post('/api/product').send(p).set('Accept', 'application/json').expect(401).end(function(err, res) {
                should.not.exist(err);
                done();
            });
        });
    });
})
