require('dotenv').config();
const mongoose = require('mongoose');


const userschema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
    


},{ timestamps: true} )

const Users = mongoose.model("Users", userschema);

module.exports = Users;