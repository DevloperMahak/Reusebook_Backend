
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('../routes/user.router');
const path = require('path');



const app = express();

const allowedOrigins = [
  'https://reusebook-frontend.onrender.com', //deployed
  'http://localhost:5000',      // Add your dev port
  'http://127.0.0.1:5000'
];

// ✅ Allow requests from frontend (CORS should come early)
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Preflight handler for all routes
app.options('*', cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

// ✅ API routes
app.use('/', userRouter);

// ✅ Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ status: false, message: 'Route not found' });
});


module.exports = app;