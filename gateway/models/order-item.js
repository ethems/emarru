"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    price: {
        type: Schema.Types.ObjectId,
        ref: 'Price'
    },
    quantity: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    modifiedDate: Date
});


orderItemSchema.pre('save', function(next) {
    const orderItem = this;
    orderItem.modifiedDate = Date.now();
    next();
});


const OrderItemModel = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItemModel;
