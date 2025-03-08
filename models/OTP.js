const mongoose = require("mongoose");
const db = require('../config/db');

const OTPSchema = new mongoose.Schema({
     EmailText:{
        type:String,
        require:true
       },
     otp:{
        type:String,
        require:true
       },
       createdAt : Date,
       expiresAt:Date,   
})

const OTPModel = new mongoose.model("OTPData",OTPSchema);
module.exports = OTPModel;