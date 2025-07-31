
const app = require('./app');
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const bcrypt = require('bcrypt');
const connectdb = require('../config/db');
const registerModel = require('../models/register_model');
const Grid = require('gridfs-stream');




const usersData=[];

connectdb(); // This will print DB connection status
const PORT = process.env.PORT || 5000;


app.get('/',(req,res)=>{
  res.send('hello');
});

app.listen(PORT,()=>{
    console.log(`successfully connected to http://localhost:${PORT}`);
});


    

