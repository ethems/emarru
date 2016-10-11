const moment = require('moment');
const validator = require('validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Price = new Schema({
    price: {
        type: Number,
        required: true
    },
    unit: String,
    currency: {
        type: String,
        default: 'TRY'
    },
    startDate: {
        type: Date,
        default: moment.utc()
    },
    endDate: Date,
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = {
    Schema: Price
};
