
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('../routes/user.router');


const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({
    extended:true
}))

app.use('/',userRouter);

app.use(bodyParser.json());

app.use(cors());


module.exports = app;