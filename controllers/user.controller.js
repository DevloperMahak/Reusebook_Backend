require('dotenv').config();
const Userservice = require('../services/user.services');
const multer = require('multer');
const registerModel = require('../models/register_model');
const OTPModel = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const {hashData} = require('../helpers/hashData');
const generateOTP = require('../helpers/generateOTP');
const loginOTP = require('../helpers/jwt_helper');
const sendMail = require('../helpers/sendEmail');
const jwt = require('jsonwebtoken')
const Image =require('../models/ImageModel')

// Upload Profile Image
exports.uploadProfileImage =async (req, res) => {
  try {
    const { userId } = req.body;
    console.log("Received userId:", userId);
    console.log("Received file:", req.file);
    if (!req.file || !userId) return res.status(400).json({ error: 'No file uploaded' });

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const savedImage = await Image.create({ imageUrl });

    res.status(200).json({
      message: 'Image uploaded successfully',
      data: savedImage,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error', details: error.message });
  }
};

// Get Image by User ID
exports.getImageByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const image = await UserImage.findOne({ userId }).sort({ uploadedAt: -1 });

    if (!image) return res.status(404).json({ error: 'No image found' });

    res.status(200).json({ image });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving image' });
  }
};

// Delete Image by User ID
exports.deleteImage = async (req, res) => {
  try {
    const { userId } = req.params;
    const image = await UserImage.findOneAndDelete({ userId });

    if (!image) return res.status(404).json({ error: 'Image not found' });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting image' });
  }
};

exports.register = async(req,res,next)=>{
    console.log("Result",req.body);
    try{
     const{
      UserType,
      FirstName,
      LastName,
      Gender,
      Address,
      State,
      City,
      PhNo,
      WhatsappNo,
      EmailText,
      PasswordNum,
      ConfirmPasswordNum,
      userType,
      ShopName,
      OwnerName,
      ShopCity,
      ShopAddress,
      ShopState,
      Pincode} = req.body;
     
     const successRes = await Userservice.registerUser(
      UserType,
      FirstName,
      LastName,
      Gender,
      Address,
      State,
      City,
      PhNo,
      WhatsappNo,
      EmailText,
      PasswordNum,
      ConfirmPasswordNum,
      userType,
      ShopName,
      OwnerName,
      ShopCity,
      ShopAddress,
      ShopState,
      Pincode);

     res.json({status:true,success:"User Registered Successfully"});

    }catch(error){
     throw error
    }
}

exports.login = async(req,res,next)=>{
    try{
     const{EmailText,PasswordNum} = req.body;
     console.log(req.body);
     
     // Fetch user from database/service
     const user = await Userservice.checkUser(EmailText);


    // Check if email is valid before doing anything else
     if(!user || !EmailText || !EmailText.includes('@')){
      console.log('Invalid Email'); 
      return res.status(400).json({ status: false, message: 'User does not exist or invalid email' });
     }

     // Compare the provided password with the stored hash
     const isMatch = await user.comparePassword(PasswordNum);

      // If password doesn't match, respond with an error
     if (!isMatch) {
        console.log('Incorrect Password');
        return res.status(400).json({ status: false, message: 'Incorrect password' });
      }
     
      const secretKey = process.env.SECRET_KEY;
     let tokenData = { id: user.id, EmailText: user.EmailText };
     const token = await loginOTP.generateToken(tokenData,"mahakSuperSecretKey", '1h' );
     
   
     res.status(200).json({status:true,token:token,userId: user.id})
    //res.json({ message: 'Login successful', token });

    }catch(error){
      console.error(error);
      return res.status(500).json({ status: false, message: 'Server error' });
    }
}


exports.bookfrontimage = async(req, res) => {
  console.log("image1",req.body);
  console.log("image1",req.file);
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded.' });
  }

  // Send the response after a successful upload
  res.send({
    message: 'File uploaded successfully!',
    file: req.file
  });
}


// Check if the user is logged in (JWT Validation)
exports.checklogin = async(req, res) => {
  const token = req.cookies.token;
  //const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.log('token not found'); 
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
     // Promisify the jwt.verify() to work with async/await
     const decoded = await new Promise((resolve, reject) => {
   jwt.verify(token,"secretkey",(err, decoded) => {
    if (err) {
      console.log('rejected'); 
      reject(err);  // Reject the promise on error
      //return res.status(401).json({ message: 'Invalid or expired token' });
    }else {
      console.log('resolved'); 
      resolve(decoded);  // Resolve the promise with decoded data
    }
    });
  })
  // If token is valid and decoded, return user data
  return res.json({ message: 'User is logged in', EmailText: decoded.EmailText });

}catch (err) {
    console.error('JWT verification error:', err);  // Log for debugging
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.sellBook = async(req,res,next)=>{
  console.log("Result",req.body);
  try{

   const{BookName,BookDescription,Publication,Author,PrintedPrice,SellingPrice} = req.body;
   
   const successRes = await Userservice.postBook(BookName,BookDescription,Publication,Author,PrintedPrice,SellingPrice);

   res.json({status:true,success:"Book Posted Successfully"});

  }catch(error){
   throw error
  }
}

exports.getBooks = async (req, res, next) => {
  try {
    // Call the getBooks function from Userservice to get the list of books
    const books = await Userservice.getBooks();
    
    // Send the books in the response
    res.json({
      status: true,
      books: books,
    });
  } catch (error) {
    // Handle any errors
    next(error);
  }
};

exports.getShopkeepers = async (req, res) => {
  try {
    const shopkeepers = await Userservice.getAllShopkeepers();
    res.status(200).json(shopkeepers);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch shopkeepers' });
  }
};

exports.generateOTP = async(req, res) => {
try{
  const { EmailText ,subject,message,duration} = req.body;

  /*function isValidEmail(EmailText) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(EmailText);
  }*/
 
  // Check if email is already registered (this example uses an in-memory DB)
  const user = await Userservice.checkUser(EmailText);

  if (!EmailText || !EmailText.includes('@') || !user) {
    return res.status(400).send('Invalid email');
  }
  const createdOTP = await Userservice.sendOTPEmail({
    EmailText,
    subject,
    message,
    duration,
  });
  res.status(200).json(createdOTP);
  console.log(createdOTP);
  console.log("Result",req.body);
  console.log(`Your OTP is ${generateOTP()}`);
  console.log(`Your OTP is ${sendMail()}`);
}catch(error){
res.status(400).send(error.message);
}
};

exports.checkOTP = (req, res,next) => {

  Userservice.verifyOTP(req.body,(error,results)=>{
    const { EmailText ,otp} = req.body;
    if (!EmailText || !otp) return res.status(400).send('Email and OTP are required.');
   if(error){
    return next(error);
   }
   return res.status(200).send({
    message : "Success",
    data : results
   })
  });
}




