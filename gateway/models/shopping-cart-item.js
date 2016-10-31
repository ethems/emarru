const moment = require('moment');
const validator = require('validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const shoppingCartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
    },
    createdDate: {
        type: Date,
        default: Date.now()
    }
});


