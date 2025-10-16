
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('../routes/user.router');
const path = require('path');



const app = express();

const allowedOrigins = [
  'https://reusebook-frontend.onrender.com', // deployed frontend
  'http://localhost:5000', // backend testing
  'http://localhost:3000', // Flutter Web default
  'http://localhost:8080'
];

// ✅ Allow requests from frontend (CORS should come early)
app.use(cors({
  origin: function(origin, callback){
    if (!origin || allowedOrigins.indexOf(origin) !== -1){
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }, 
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

// ✅ Health route (used by UptimeRobot)
app.get('/health', (req, res) => {
  res.status(200).send('Server is alive 🚀');
});

// ✅ Routes
app.use('/', userRouter);


module.exports = app;