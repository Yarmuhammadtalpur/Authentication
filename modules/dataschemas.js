require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate')

const userschema = new mongoose.Schema({
    email:{
        type: String,
    },
    password:{
        type: String,
    },
    googleId:{
        type: String
    },
    facebookId:{
        type: String
    }
    


},{ timestamps: true} )

userschema.plugin(passportLocalMongoose);

//plugin of findOrCreate method in passportjs oauth..
userschema.plugin(findOrCreate);

const Users = mongoose.model("Users", userschema);


module.exports = Users;