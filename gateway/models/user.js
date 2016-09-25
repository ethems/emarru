var moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    createdDate: Date,
    modififedDate:Date
});

userSchema.pre('save',function(next){
    const user=this;
    user.modififedDate=moment.utc();
    next();
});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;
