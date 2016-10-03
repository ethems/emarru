'use strict';

const express = require('express');
var request = require('supertest');
var should = require('should');

var request = request('http://localhost:3000');


describe('POST/signup', function() {
  it('should get 400 validation error if there is no email', function(done) {
    request
      .post('/api/signup')
      .set('Accept', 'application/json')
      .expect(400)
      .end(function (err, res) {
        should.not.exist(err);
        done();
      });
  });
  it('should get 200 if complete model is sent', function(done) {

    var u={
      name:{
        firstName:"ff",
        lastName:"ll"
      },
      email:"ff@lll.com",
      password:"123456"
    };
    request
      .post('/api/signup')
      .send(u)
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        res.body.email.should.equal('ff@lll.com');
        done();
      });
  });

});
