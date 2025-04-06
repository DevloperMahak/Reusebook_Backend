const { JsonWebTokenError } = require('jsonwebtoken');
const registerModel = require('../models/register_model');
const postedbookModel = require('../models/bookposting_model');
const Image =require('../models/ImageModel')
const OTPModel = require('../models/OTP');
const Grid = require('gridfs-stream');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { create } = require('domain');
const Key = "otp-secret-key"
const generateOTP = require('../helpers/generateOTP');
const sendMail = require('../helpers/sendEmail');
const {AUTH_EMAIL} = process.env;
const {hashData} = require('../helpers/hashData');
const cookieParser = require('cookie-parser');
const { connection } = require('mongoose');
const mongoose = require('mongoose');
const path = require('path');



const otpStore = {};



// Multer memory storage for handling the image file
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"./uploads");// Uploads folder
  },
  filename:(any,file,cb)=>{
   cb(null,req.decoded.EmailText,".jpg")
  },
});

const fileFilter = (req,file,cb)=>{
  if (file.mimeType == "image/jpeg" || file.mimeType == "image/png"){
    cb(null,true);
  }else{
    cb(null,false);
  }
}

const upload = multer({ 
  storage:storage,
  limits:{
    fileSize:1024*1024*6,
  },
  fileFilter:fileFilter
 }).single("frontimage")







class UserService{
  
    
    static async registerUser(
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
      Pincode){
        try{
         const createUser = new registerModel({
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
          Pincode});

    // Check if password and confirm password match
    if (PasswordNum !== ConfirmPasswordNum) {
      return { status: false, message: 'Passwords do not match' };
    }

    // Check if email is already registered
    const existingUser = await UserService.checkUser(EmailText);
    if (existingUser) {
      return { status: false, message: 'Email already exists. Please use a different email.' };
    }
         return await createUser.save();
         
        }catch(err){
         throw err;
        }
    }
   
    
    static async checkUser(EmailText){
      try{
      return await registerModel.findOne({EmailText});
        
      
      }catch(err){
          throw err;
      }
  }

    static async comparePassword(PasswordNum){
      try{
      const isMatch = await bcrypt.compare(PasswordNum,registerModel.PasswordNum);
      return isMatch;
      }catch(err){
        throw err;
      
      }
  }

  static async verifyToken(PasswordNum){
    const token = req.cookies.token;
    try{
    const isMatch = await bcrypt.compare(PasswordNum,registerModel.PasswordNum);
    return isMatch;
    }catch(err){
      throw err;
    
    }
}

static async postBook(BookName,BookDescription,Publication,Author,PrintedPrice,SellingPrice){
  try{
   const bookdetails = new postedbookModel({BookName,BookDescription,Publication,Author,PrintedPrice,SellingPrice});

   return await bookdetails.save();
   
  }catch(err){
   throw err;
  }
}

// Function to get all books from MongoDB
static async getBooks(){
  try {
    // Fetch all books from MongoDB
    const books = await postedbookModel.find();
    return books; // Return the list of books
  } catch (error) {
    throw new Error('Error fetching books from MongoDB');
  }
};

static async getAllShopkeepers(){
  try {
    const shopkeepers = await registerModel.find({ UserType: 'Shopkeeper' });
    return shopkeepers;
  } catch (error) {
    throw new Error('Error fetching shopkeepers');
  }
};


// Handle file upload logic
static uploadImage(req, res, next){
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).send({ message: err });
    }
    next();  // Continue to the next middleware/controller (UserController)
  });
};


// Function to save the user with their profile image URL
static async saveBookImage (req) {
  return new Promise((resolve, reject) => {
    if (!req.file) {
      return reject('No file uploaded');
    }
    const newImage = new bookimageModel({
      imageData: req.file.buffer,
      contentType: req.file.mimetype,
    });

    newImage.save()
    .then(() => res.status(200).send('Image uploaded successfully.'))
    .catch(err => res.status(500).send('Error uploading image.'));

    /*const { buffer, mimetype, originalname } = req.file;
    uploadImage(buffer, originalname, mimetype)
      .then((file) => {
        resolve(file);
      })
      .catch((err) => {
        reject(err);
      });*/
  });
};

     
   
          static async sendOTPEmail(EmailText,subject,message,duration=1){
          try{
            if(!(EmailText && subject && message)){
              throw Error("Provide values for email,subject,message");
            }
             //clear any old record
             await OTPModel.deleteOne({EmailText});

             //generate OTP
             const OTP = await generateOTP();
             console.log(`Your OTP is ${OTP}`);

             //send email
             await sendMail(mailOptions);

             //Save otp record
         const hashedOTP = await hashData(OTP);
         const newOTP =  await new OTPModel({
          EmailText,
          otp : hashedOTP,
          createAt : Date.now(),
          expireAt : Date.now() + 5*60*1000 ,
         });
          const createdOTPRecord = await newOTP.save();
          return createdOTPRecord;

          }catch(error){
           throw error
          }
          };
      

        static async verifyOTP(EmailText, otp){
          const otpRecord = otpStore[EmailText];
          if (!otpRecord) return res.status(400).send('Invalid OTP or OTP expired.');

          // Check if OTP matches and is not expired
          if (otpRecord.otp === otp && Date.now() < otpRecord.expires) {
            res.status(200).send('OTP verified successfully');
          } else {
            res.status(400).send('Invalid OTP or OTP expired');
          }
        }

       
}



module.exports = UserService;