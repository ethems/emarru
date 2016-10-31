const moment = require('moment');
const validator = require('validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const shoppingCartItemSchema = require('./shopping-cart-item').Schema;

const shoppingCartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shoppingCartItems: [
      shoppingCartItemSchema
    ]
});

const ShoppingCartModel = mongoose.model('ShoppingCart', shoppingCartSchema);

module.exports = ShoppingCartModel;
