const moment = require('moment');
const validator = require('validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const priceSchema = new Schema({
    price: {
        type: Number,
        required: true
    },
    unit: String,
    currency: {
        type: String,
        default: 'TRY'
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    endDate: Date,
    active: {
        type: Boolean,
        default: true
    }
});


const PriceModel = mongoose.model('Price', priceSchema);

module.exports = PriceModel;
