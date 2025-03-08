
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://localhost:27017/reuseBook");
const registerModel = require('../models/register_model');

// Set up GridFS stream
const conn = mongoose.connection;

//check database connected or not
const connection = connect.then(()=>{
    console.log("Database connected successfully.");
})
.catch(()=>{
    console.log("Database not connected successfully.");
})


module.exports = connection;

