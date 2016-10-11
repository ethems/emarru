const validator = require('validator');
const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;
const Price = require('./price').Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        set: capitalize,
        unique: true
    },
    priceHistory: [Price]
});

productSchema.statics.expireActivePrice = function(productId, fn) {
    this.update({
        _id: productId,
        "priceHistory.active": true
    }, {
        $set: {
            "priceHistory.$.active": false,
            "priceHistory.$.endDate": moment.utc()
        }
    }, fn);
};
productSchema.statics.addNewPrice = function(productId, newPrice, fn) {
    this.findByIdAndUpdate({
        _id: productId
    }, {
        $push: {
            priceHistory: newPrice
        }
    }, {
        new: true
    }, fn);
};
productSchema.statics.updatePrice = function(productId, newPrice, fn) {
  const that=this;
    this.expireActivePrice(productId, function(err, doc) {
        if(err){
          throw(err);
        }
        that.addNewPrice(productId,newPrice, fn);
    });

}

function capitalize(val) {
    if (!val) {
        return "";
    }
    return val.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
