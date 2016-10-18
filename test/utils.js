'use strict';

//  Modified from https://github.com/elliotf/mocha-mongoose

var config = require('../configuration.json');
var mongoose = require('mongoose');

// ensure the NODE_ENV is set to 'test'
// this is helpful when you would like to change behavior when testing
process.env.NODE_ENV = 'test';

before(function(done) {

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove();
        }
        mongoose.connection.collections.users.insert({
            email: 'admin@admin.com',
            passwordHash: '$2a$12$4XZmaQHV5o0chUjqGHssk.8IlAkzzUAgIH1ZqaV/M0lyS1GXfmq8y',
            admin: true,
            name: {
                firstName: "admin",
                lastName: "admin"
            }
        });
        mongoose.connection.collections.users.insert({
            email: 'enduser@enduser.com',
            passwordHash: '$2a$12$R0f2g0lcVfSlzlopePL6He3l7zFwWn0Cet0lxc0rQh3Oa5bVMVXTG',
            admin: false,
            name: {
                firstName: "enduser",
                lastName: "enduser"
            }
        });
        mongoose.connection.collections.products.insert({
          name:"Avokado"
        });
        return done();
    }

    function reconnect() {
        mongoose.connect(config.DB.test, function(err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    }

    function checkState() {
        switch (mongoose.connection.readyState) {
            case 0:
                reconnect();
                break;
            case 1:
                clearDB();
                break;
            default:
                process.nextTick(checkState);
        }
    }

    checkState();

});

after(function(done) {
    mongoose.disconnect();
    return done();
});
