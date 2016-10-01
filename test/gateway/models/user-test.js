'use strict';

// import the moongoose helper utilities
var utils = require('../../utils');
var should = require('should');
// import our User mongoose model
var User = require('../../../gateway/models/user');

describe('Users: models', function() {

    it('should create a new User', function(done) {
        // Create a User object to pass to User.create()
        var u = {
            email: "Mesut",
            password: "123456"
        };
        User.create(u, function(err, createdUser) {
            // Confirm that that an error does not exist
            should.not.exist(err);
            // verify that the returned user is what we expect
            createdUser.email.should.equal('Mesut');
            createdUser.password.should.equal('123456');
            // Call done to tell mocha that we are done with this test
            done();
        });
    });

    it('should find a existed User', function(done) {
        User.findOne({
            'email': 'Mesut'
        }, function(err, foundUser) {
            should.not.exist(err);

            foundUser.email.should.equal('Mesut');
            foundUser.password.should.equal('123456');

            done();
        });
    });

    it('should update a existed User', function(done) {
        User.findOne({
            'email': 'Mesut'
        }, function(err, foundUser) {
            should.not.exist(err);

            foundUser.password = '654321';
            foundUser.save(function(err) {
                should.not.exist(err);

                foundUser.password.should.equal('654321');
                done();
            });

        });
    });

});
