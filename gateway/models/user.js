const moment = require('moment');
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Constants
var BCRYPT_COST = 12;
//...

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    phoneNumbers: {
        mobile: String,
        work: String
    },
    createdDate: {
        type: Date,
        default: moment.utc()
    },
    modifiedDate: Date
});

userSchema.statics.hashPassword = function(passwordRaw, fn) {
    // encrypt the password
    bcrypt.hash(passwordRaw, BCRYPT_COST, fn);
};
userSchema.statics.comparePasswordAndHash = function(password, passwordHash, fn) {
    // compare the password to the passwordHash
    bcrypt.compare(password, passwordHash, fn);
};

userSchema.pre('save', function(next) {
    const user = this;
    user.modifiedDate = moment.utc();
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
