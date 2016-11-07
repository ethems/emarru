'use strict';

var should = require('should');
var User = require('../../../gateway/models/user');

describe('Users: models', function() {
    describe('#Create', function() {
        it('should create a new User', function(done) {
            var u = {
                name: {
                    firstName: "Mesut",
                    lastName: "Yazar"
                },
                email: "mesut@gmail.com",
                passwordHash: "123456"
            };
            User.create(u, function(err, createdUser) {
                should.not.exist(err);
                createdUser.email.should.equal('mesut@gmail.com');
                createdUser.passwordHash.should.equal('123456');
                createdUser.addresses.length.should.equal(0);
                done();
            });
        });

        it('should create a new User with lowercase email if email is capitilized', function(done) {
            var u = {
                name: {
                    firstName: "Mesut",
                    lastName: "Yazar"
                },
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
                name: {
                    firstName: "Mesut",
                    lastName: "Yazar"
                },
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
                name: {
                    firstName: "Mesut",
                    lastName: "Yazar"
                },
                email: "mesut5@gmail.com",
                password: ""
            };
            User.create(u, function(err, createdUser) {
                should.exist(err);
                done();
            });
        });

        it('should throw exception  if there is noncomplete address ', function(done) {
            var a={
              streetLine1:"xxxxxx"
            };
            var u = {
                name: {
                    firstName: "Mesut",
                    lastName: "Yazar"
                },
                addresses:[a],
                email: "mesut6@gmail.com",
                passwordHash: "123456"
            };
            User.create(u, function(err, createdUser) {
                should.exist(err);
                done();
            });
        });

        it('should create a new user with address ', function(done) {
            var a={
              streetLine1:"st1",
              city:"c1",
              zip:"z1"
            };
            var u = {
                name: {
                    firstName: "Mesut",
                    lastName: "Yazar"
                },
                addresses:[a],
                email: "mesut7@gmail.com",
                passwordHash: "123456"
            };
            User.create(u, function(err, createdUser) {

                should.not.exist(err);
                createdUser.addresses[0].streetLine1.should.equal('st1');
                createdUser.addresses[0].city.should.equal('c1');
                createdUser.addresses[0].zip.should.equal('z1');
                done();
            });
        });

    });
    describe('#Find', function() {
        it('should find a existed User', function(done) {
          User.findOne({
              'email': 'enduser@enduser.com'
          }, function(err, foundUser) {
              should.not.exist(err);
              foundUser.email.should.equal('enduser@enduser.com');
              done();
          });
        });
    });
    describe("#Update", function() {
        it('should update a existed User', function(done) {
          User.findOne({
              'email': 'enduser@enduser.com'
          }, function(err, foundUser) {
              foundUser.name.middleName = 'middleName';
              foundUser.save(function(err) {
                  should.not.exist(err);
                  foundUser.name.middleName.should.equal('Middlename');
                  done();
              });
          });
        });
        it('should update a existed User address', function(done) {
          User.findOne({
              'email': 'enduser@enduser.com'
          }, function(err, foundUser) {
              foundUser.name.middleName = 'middleName';
              foundUser.addresses=[{
                streetLine1:"st1",
                city:"c1",
                zip:"z1"
              },{
                streetLine1:"st1",
                city:"c1",
                zip:"z1"
              },{
                streetLine1:"st1",
                city:"c1",
                zip:"z1"
              }];
              foundUser.save(function(err) {
                  should.not.exist(err);
                  foundUser.name.middleName.should.equal('Middlename');
                  foundUser.addresses.length.should.equal(3);
                  done();
              });
          });
        });
    });

    describe("#PasswordHashing", function() {
        it('should return a hashed password asynchronously', function(done) {
            var password = 'secret';
            User.hashPassword(password, function(err, passwordHash) {
                should.not.exist(err);
                should.exist(passwordHash);
                done();
            });
        });

        it('should return true if password is valid', function(done) {

            var password = 'secret';

            User.hashPassword(password, function(err, passwordHash) {
                User.comparePasswordAndHash(password, passwordHash, function(err, areEqual) {
                    should.not.exist(err);
                    areEqual.should.equal(true);
                    done();
                });
            });
        });

        it('should return false if password is invalid', function(done) {
            var password = 'secret';
            User.hashPassword(password, function(err, passwordHash) {
                var fakePassword = 'imahacker';
                User.comparePasswordAndHash(fakePassword, passwordHash, function(err, areEqual) {
                    should.not.exist(err);
                    areEqual.should.equal(false);
                    done();
                });
            });
        });

    });

});
