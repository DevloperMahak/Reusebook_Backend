const express = require('express');
const multer = require('multer');
const path = require('path');
const {  deleteImage } = require('../controllers/user.controller');
const router = require('express').Router();
const upload = require('../middleware/upload'); 




const UserController = require("../controllers/user.controller")
router.post('/registration',UserController.register);
router.post('/login',UserController.login);
router.post('/sendOTP',UserController.generateOTP);
router.post('/confirmOTP',UserController.checkOTP);
router.post('/resetPassword',UserController.login);
router.post('/postBook',UserController.sellBook);
router.get('/getBook',UserController.getBooks);
// Route to get all shopkeepers
router.get('/shopkeepers', UserController.getShopkeepers);
//router.post('/image1upload',uploadImage,UserController.bookfrontimage);
router.get('/check-login',UserController.checklogin);
router.post('/upload-profile-image', upload.single('profileImage'), UserController.uploadProfileImage);
router.get('/image/:userId', UserController.getImageByUserId);
//router.get('/profile-image/:userId', getImageByUserId);
router.delete('/profile-image/:userId', deleteImage);


module.exports = router;