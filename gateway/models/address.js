"use strict";


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    streetLine1: {
        type: String,
        required: true
    },
    streetLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    state: String,
    country: {
        type: String,
        default: "Turkey"
    }
});

module.exports = {
    Schema: addressSchema
};
