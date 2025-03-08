
const app = require('./app');
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const registerModel = require('../models/register_model');
const Grid = require('gridfs-stream');




const usersData=[];

port = 5000;

app.get('/',(req,res)=>{
  res.send('hello');
});

app.listen(port,()=>{
    console.log(`successfully connected to http://localhost:${port}`);
});


    

