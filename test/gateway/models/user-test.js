'use strict';

// import the moongoose helper utilities
var utils = require('../../utils');
var should = require('should');
// import our User mongoose model
var User = require('../../../gateway/models/user');

describe('Users: models', function() {
    describe('#Create', function() {
        it('should create a new User', function(done) {
            // Create a User object to pass to User.create()
            var u = {
                email: "mesut@gmail.com",
                passwordHash: "123456"
            };
            User.create(u, function(err, createdUser) {
                // Confirm that that an error does not exist
                should.not.exist(err);
                // verify that the returned user is what we expect
                createdUser.email.should.equal('mesut@gmail.com');
                createdUser.passwordHash.should.equal('123456');
                // Call done to tell mocha that we are done with this test
                done();
            });
        });

        it('should create a new User with lowercase email if email is capitilized', function(done) {
            // Create a User object to pass to User.create()
            var u = {
                email: "MeSut2@GmAIl.Com",
                passwordHash: "123456"
            };
            User.create(u, function(err, createdUser) {
                should.not.exist(err);
                createdUser.email.should.equal('mesut2@gmail.com');
                createdUser.passwordHash.should.equal('123456');
                done();
            });
        });

        it('should throw exception if there is no email', function(done) {
            var u = {
                email: "",
                password: "123456"
            };
            User.create(u, function(err, createdUser) {

                should.exist(err);

                done();
            });
        });

        it('should throw exception if there is no password', function(done) {
            var u = {
                email: "mesut5@gmail.com",
                password: ""
            };
            User.create(u, function(err, createdUser) {

                should.exist(err);

                done();
            });
        });

    });
    describe('#Find', function() {
        it('should find a existed User', function(done) {
            var u = {
                email: "mesut3@gmail.com",
                passwordHash: "123456"
            };
            User.create(u, function(err, createdUser) {
                User.findOne({
                    'email': 'mesut3@gmail.com'
                }, function(err, foundUser) {
                    should.not.exist(err);
                    foundUser.email.should.equal('mesut3@gmail.com');
                    foundUser.passwordHash.should.equal('123456');
                    done();
                });
            });
        });
    });
    describe("#Update", function() {
        it('should update a existed User', function(done) {

            var u = {
                email: "mesut4@gmail.com",
                passwordHash: "123456"
            };
            User.create(u, function(err, createdUser) {
                User.findOne({
                    'email': 'mesut4@gmail.com'
                }, function(err, foundUser) {
                    foundUser.password = '654321';
                    foundUser.save(function(err) {
                        should.not.exist(err);

                        foundUser.password.should.equal('654321');
                        done();
                    });
                });
            });

        });

    });

    describe("#PasswordHashing", function() {
        it('should return a hashed password asynchronously', function(done) {

            var password = 'secret';

            User.hashPassword(password, function(err, passwordHash) {
                // Confirm that that an error does not exist
                should.not.exist(err);
                // Confirm that the passwordHash is not null
                should.exist(passwordHash);
                done();
            });
        });

        it('should return true if password is valid', function(done) {

            var password = 'secret';

            // first we need to create a password hash
            User.hashPassword(password, function(err, passwordHash) {
                // Confirm that that an error does not exist
                User.comparePasswordAndHash(password, passwordHash, function(err, areEqual) {
                    // Confirm that that an error does not exist
                    should.not.exist(err);
                    // Confirm that the areEqaul is `true`
                    areEqual.should.equal(true);
                    // notice how we call done() from the final callback
                    done();
                });
            });
        });

        it('should return false if password is invalid', function(done) {

            var password = 'secret';

            // first we need to create a password hash
            User.hashPassword(password, function(err, passwordHash) {

                var fakePassword = 'imahacker';

                // Confirm that that an error does not exist
                User.comparePasswordAndHash(fakePassword, passwordHash, function(err, areEqual) {
                    // Confirm that that an error does not exist
                    should.not.exist(err);
                    // Confirm that the are Eqaul is `false`
                    areEqual.should.equal(false);
                    done();
                });
            });
        });

    });

});
