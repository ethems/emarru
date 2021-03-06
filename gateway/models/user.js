"use strict";

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const addressSchema = require('./address').Schema;
const  BCRYPT_COST = 12;
const capitalize = (val)=> {
    if (!val) {
        return "";
    }
    return val.charAt(0).toUpperCase() + val.substring(1).toLowerCase();
};

const userSchema = new Schema({
    name: {
        firstName: {
            type: String,
            required: true,
            set: capitalize
        },
        middleName: {
            type: String,
            set: capitalize
        },
        lastName: {
            type: String,
            required: true,
            set: capitalize
        }
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    phoneNumbers: {
        mobile: String,
        work: String
    },
    addresses: [addressSchema],
    admin: {
        type: Boolean,
        default: false
    },
    createdDate: {
        type: Date,
        default: Date.now()
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
userSchema.statics.findOneByEmail = function(email, fn) {
    this.findOne({
        email: email.toLowerCase()
    }, fn);
};

userSchema.pre('save', function(next) {
    const user = this;
    user.modifiedDate = Date.now();
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
