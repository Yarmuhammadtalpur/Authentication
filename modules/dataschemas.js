require('dotenv').config();
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userschema = new mongoose.Schema({
    email:{
        type: String,
    },
    password:{
        type: String,
    }
    


},{ timestamps: true} )

userschema.plugin(passportLocalMongoose);

const Users = mongoose.model("Users", userschema);


module.exports = Users;