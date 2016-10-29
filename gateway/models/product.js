const validator = require('validator');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const Schema = mongoose.Schema;
const Price = require('./price');

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        set: capitalize,
        unique: true
    },
    priceHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Price'
        }
    ],
    createdDate: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    },
    modifiedDate: Date
});

productSchema.pre('save', function(next) {
    const product = this;
    product.modifiedDate = Date.now();
    next();
});
productSchema.statics.findByName=function(productName,fn){
  this.findOne({name:capitalize(productName)},fn);
};

productSchema.statics.expireActivePrice = function(productId, fn) {
    Price.update({
        productId: productId,
        active: true
    }, {
        $set: {
            active: false,
            endDate: Date.now()
        }
    }, fn);
};
productSchema.statics.addNewPrice = function(productId, newPrice, fn) {
    var price = new Price(_.extend({
        productId: productId
    }, newPrice));
    price.save(fn);

};
productSchema.statics.addPriceHistory = function(productId, priceId, fn) {
    this.update({
        _id: productId
    }, {
        $push: {
            'priceHistory': priceId
        }
    }, fn);
};
productSchema.statics.getWithAllPricesAfter=function(productId,date,fn){
  this.findById(productId).populate({path:'priceHistory',match:{
    $or:[{startDate:{"$gte":date}},{active:true}]
  }}).exec(fn)
};
productSchema.statics.getWithLastNPrices=function(productId,limit,fn){
  if(!isNaN(limit)){
    limit=1;
  }
  this.findById(productId).populate({path:'priceHistory',options:{limit:+limit,sort: {startDate: -1}}}).exec(fn)
};
productSchema.statics.getWithActivePrice=function(productId, fn){
  this.findById(productId).populate({path:'priceHistory',match:{active:true}}).exec(fn)
}
productSchema.statics.updatePrice = function(productId, newPrice, fn) {
    const that = this;
    this.expireActivePrice(productId, function(err) {
        if (err) {
            throw(err);
        }
        that.addNewPrice(productId, newPrice, function(err, price) {
            if (err) {
                throw(err);
            }
            that.addPriceHistory(productId, price.id, function(err) {
                if (err) {
                    throw(err);
                }
                that.getWithActivePrice(productId,fn);
            })
        })

    });

}
productSchema.statics.getAllWithActivePrice = function(fn){
  this.find().populate({path:'priceHistory',match:{active:true}}).exec(fn);
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
