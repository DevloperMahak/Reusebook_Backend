const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadProfileImage , getImageByUserId, deleteImage } = require('../controllers/user.controller');
//const { uploadImage } = require('../services/user.services');


// Set up multer storage engine
//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });
// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });
  const upload = multer({ storage });

const router = require('express').Router();

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
router.post('/upload-profile-image', upload.single('image'), uploadProfileImage);
router.get('/profile-image/:userId', getImageByUserId);
router.delete('/profile-image/:userId', deleteImage);

module.exports = router;