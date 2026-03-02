const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
const registerModel = require("../models/register_model");

// Set up GridFS stream
const conn = mongoose.connection;

//check database connected or not
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Database connected successfully.");
  })
  .catch(() => {
    console.log("Database not connected successfully.");
  });

module.exports = connection;
