
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb+srv://mahakguptaji2005:Lq1yG4ry04fBsSjO@reusebook-cluster.zip2ptq.mongodb.net/?retryWrites=true&w=majority&appName=reusebook-cluster");
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

