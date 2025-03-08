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




exports.register = async(req,res,next)=>{
    console.log("Result",req.body);
    try{
     const{FirstName,LastName,Gender,DOB,BirthPlace,PhNo,WhatsappNo,CollegeName,CollegeState,Branch,Degree,PassYear,EmailText,PasswordNum,ConfirmPasswordNum} = req.body;
     
     const successRes = await Userservice.registerUser(FirstName,LastName,Gender,DOB,BirthPlace,PhNo,WhatsappNo,CollegeName,CollegeState,Branch,Degree,PassYear,EmailText,PasswordNum,ConfirmPasswordNum);

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
     
     res.status(200).json({status:true,token:token})
    //res.json({ message: 'Login successful', token });

    }catch(error){
      console.error(error);
      return res.status(500).json({ status: false, message: 'Server error' });
    }
}

/*UPLOAD_PATH= 'http://localhost:5000/image1upload'

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null,UPLOAD_PATH ); // Path where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.image1)); // Set file name to current timestamp
  }
});

// Initialize Multer
const upload1 = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
}).single('image1'); // The name of the file input field

exports.bookfrontimage = async(req,res,next)=>{
  upload1(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const image1 = `http://localhost:5000/image1upload/${req.file.filename}`;

    try {
      const updatedUser = await Userservice.saveUserImage(image1);
      return res.status(200).json({
        message: 'Image uploaded successfully',
        user: updatedUser,
        imageUrl: image1,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  
}*/


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

/*exports.generateOTP = async(req, res) => {
    const { EmailText } = req.body;
    
    // Check if email is already registered (this example uses an in-memory DB)
    if (!EmailText || !EmailText.includes('@')) {
      return res.status(400).send('Invalid email');
    }
    try {
        // Send OTP to user's email
        await Userservice.sendOTPEmail(EmailText, otp);
        res.send('OTP sent to email');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error sending OTP');
      }
}*/

/*exports.generateOTP = (req, res) => {
  const { EmailText } = req.body;

  if (!EmailText) {
    return res.status(400).send('Email is required');
  }

  const otp = generateOTP(); // Generate OTP
  Userservice.sendOTPEmail(EmailText, otp);  // Send OTP via email

  // Store OTP temporarily (e.g., in memory or database)
  // In production, you might want to store it in a database with expiration time
  otpStore[EmailText] = { otp, otpExpire: Date.now() + 10 * 60 * 1000 }; // 10 minutes expiry



  res.status(200).send('OTP sent to your email');
};*/
/*exports.generateOTP = async(req, res,next) => {
  console.log("Result",req.body);
  const { EmailText } = req.body;
  
  // Check if email is already registered (this example uses an in-memory DB)

  const user = await Userservice.checkUser(EmailText);

  if (!EmailText || !EmailText.includes('@') || !user) {
    return res.status(400).send('Invalid email');
  }
  Userservice.sendOTPEmail(req.body,(error,results)=>{
   if(error){
    return next(error);
   }
   return res.status(200).send({
    message : "OTP sent to your email",
    data : results
   })
  });
}*/

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




