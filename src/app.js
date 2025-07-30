
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('../routes/user.router');
const path = require('path');



const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({
    extended:true
}))

// ✅ Static folder setup (to access uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/',userRouter);

app.use(bodyParser.json());

// Allow requests from your frontend URL
app.use(cors(
  {
    origin: 'https://reusebook-frontend.onrender.com',  // replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
  }
));// Enables cross-origin requests


module.exports = app;