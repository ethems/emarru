const moment = require('moment');
const validator = require('validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const addressSchema = new Schema({
    streetLine1: {
        type: String,
        required: true
    },
    streetLine2: {
        type: String
    },
    city:{
      type:String,
      required:true
    },
    zip:{
      type:String,
      required:true
    },
    state:String,
    country:{
      type:String,
      default: "Turkey"
    }
});

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        maxlength: 50,
        minLength: 5,
        unique: true,
        set: function capitalize(val) {
            return val.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        validate: [validator.isEmail, '{VALUE} is not a valid email!']
    },
    photo: Buffer,
    mobilePhoneNumber: {
        type: String,
        validate: {
            validator: function(v) {
                return validator.isMobilePhone(v, 'tr-TR');
            },
            message: '{VALUE} is not a valid phone number!'
        }
    },
    workPhoneNumber: {
        type: String
    },
    addresses:[addressSchema],
    createdDate: {
        type: Date,
        default: moment.utc()
    },
    modififedDate: Date
});

userSchema.pre('save', function(next) {
    const user = this;
    user.modififedDate = moment.utc();
    next();
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
