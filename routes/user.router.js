
const multer = require('multer');
//const { uploadImage } = require('../services/user.services');

// Set up multer storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = require('express').Router();
const UserController = require("../controllers/user.controller")
router.post('/registration',UserController.register);
router.post('/login',UserController.login);
router.post('/sendOTP',UserController.generateOTP);
router.post('/confirmOTP',UserController.checkOTP);
router.post('/resetPassword',UserController.login);
router.post('/postBook',UserController.sellBook);
router.get('/getBook',UserController.getBooks);
//router.post('/image1upload',uploadImage,UserController.bookfrontimage);
router.get('/check-login',UserController.checklogin);
module.exports = router;