"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addressSchema = require('./address').Schema;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }],
    address: {
        type: addressSchema,
        required: true
    },
    note: String,
    createdDate: {
        type: Date,
        default: Date.now()
    }
    //TODO Status
});


orderSchema.statics.getAllByUserId = function(userId, fn) {
    this.find({
        'user': userId
    }).populate({
        path: 'orderItems',
        populate: [
            {
                path: 'product',
                model: 'Product'
            },
            {
                path: 'price',
                model: 'Price'
            }
        ]
    }).exec(fn);
};

const OrderModel = mongoose.model('Order', orderSchema);


module.exports = OrderModel;
