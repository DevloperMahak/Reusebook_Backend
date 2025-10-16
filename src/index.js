
const app = require('./app');
require('dotenv').config();
const mongoose = require("mongoose");
const path = require('path');
const connectdb = require('../config/db');
const registerModel = require('../models/register_model');





const usersData=[];

connectdb(); // This will print DB connection status
const PORT = process.env.PORT || 5000;


app.get('/',(req,res)=>{
  res.send('hello');
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});


    

