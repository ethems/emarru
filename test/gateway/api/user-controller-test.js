'use strict';

const express = require('express');
var request = require('supertest');
var should = require('should');

var request = request('http://localhost:3000');

describe('User Controller', function() {
    describe('PUT/user', function() {
        it('should get 401 unauthentication code if there is no token', function(done) {
            request.put('/api/user').set('Accept', 'application/json').expect(401).end(function(err, res) {
                should.not.exist(err);
                done();
            });
        });

        it('should get 200 code and user if there is correct token', function(done) {
            var u = {
                email: "enduser@enduser.com",
                password: "enduser"
            };
            request.post('/api/signin').send(u).end(function(err, res) {
                var updatedU = Object.assign({}, u, {
                    name: {
                        firstName: "enduser_updated",
                        lastName: "ll"
                    },
                    addresses:[]
                });
                request.put('/api/user').set('authorization', res.body.token).set('Accept', 'application/json').send(updatedU).expect(200).end(function(err, res) {
                    should.not.exist(err);
                    res.body.user.email.should.equal('enduser@enduser.com');
                    res.body.user.name.firstName.should.equal('Enduser_updated');
                    done();
                });
            });

        });


        it('should get 500 code and user if there is correct token but wrong address', function(done) {
            var u = {
              email: "enduser@enduser.com",
              password: "enduser"
            };
            request.post('/api/signin').send(u).end(function(err, res) {
                var updatedU = Object.assign({}, u, {
                    name: {
                        firstName: "ff_update",
                        lastName: "ll"
                    },
                    addresses:[
                      {
                        streetLine1:"xx"
                      }
                    ]
                });
                request.put('/api/user').set('authorization', res.body.token).set('Accept', 'application/json').send(updatedU).expect(500).end(function(err, res) {
                    should.not.exist(err);
                    done();
                });
            });

        });

        it('should get 200 code and user if there is correct token and  correct address', function(done) {
            var u = {
              email: "enduser@enduser.com",
              password: "enduser"
            };
            request.post('/api/signin').send(u).end(function(err, res) {
                var updatedU = Object.assign({}, u, {
                    name: {
                        firstName: "enduser_updated",
                        lastName: "enduser_updated"
                    },
                    addresses:[
                      {
                        streetLine1:"xx",
                        city:"xx",
                        zip:"xxx"
                      }
                    ]
                });
                request.put('/api/user').set('authorization', res.body.token).set('Accept', 'application/json').send(updatedU).expect(200).end(function(err, res) {
                    should.not.exist(err);
                    res.body.user.email.should.equal('enduser@enduser.com');
                    res.body.user.addresses[0].streetLine1.should.equal('xx');
                    done();
                });
            });

        });

    });
})
