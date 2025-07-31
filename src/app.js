
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('../routes/user.router');
const path = require('path');



const app = express();

// ✅ Allow requests from frontend (CORS should come early)
app.use(cors({
  origin: 'https://reusebook-frontend.onrender.com',  // ✅ Replace with your deployed frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Middleware setup
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Static folder to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ✅ Routes
app.use('/', userRouter);


module.exports = app;