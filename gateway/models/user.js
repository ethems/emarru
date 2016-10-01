const moment = require('moment');
const validator = require('validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const userSchema = new Schema({
  email:String,
  password:String,
  createdDate:Date,
  modifiedDate:Date
});

userSchema.pre('save', function(next) {
    const user = this;
    user.modifiedDate = moment.utc();
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
