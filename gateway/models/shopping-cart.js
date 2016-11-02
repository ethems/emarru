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

shoppingCartSchema.statics.FindByUserId=function(userId,fn){
  this.findOne({
      'user': userId,
      'shoppingCartItems':{
        $elemMatch:{createdDate: {$gte: moment().startOf('day')}}
      }
  }).populate({path:'shoppingCartItems.product',populate:{path:'priceHistory',model:'Price',match:{active:true}}})
  .exec(fn);
};

const ShoppingCartModel = mongoose.model('ShoppingCart', shoppingCartSchema);

module.exports = ShoppingCartModel;
