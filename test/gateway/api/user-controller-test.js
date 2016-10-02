'use strict';

const express = require('express');
var request = require('supertest');
var should = require('should');

var request = request('http://localhost:3000');


describe('GET /user', function() {
  it('respond with json', function(done) {
    request
      .get('/api/add/1/1')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        should.not.exist(err);
        parseFloat(res.text).should.equal(2);
        done();
      });
  });
});
