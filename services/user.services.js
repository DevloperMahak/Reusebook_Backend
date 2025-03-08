const { JsonWebTokenError } = require('jsonwebtoken');
const registerModel = require('../models/register_model');
const postedbookModel = require('../models/bookposting_model');
const bookimageModel = require('../models/bookimages_model');
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
    cb(null,"./uploads");
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
  
    
    static async registerUser(FirstName,LastName,Gender,DOB,BirthPlace,PhNo,WhatsappNo,CollegeName,CollegeState,Branch,Degree,PassYear,EmailText,PasswordNum,ConfirmPasswordNum){
        try{
         const createUser = new registerModel({FirstName,LastName,Gender,DOB,BirthPlace,PhNo,WhatsappNo,CollegeName,CollegeState,Branch,Degree,PassYear,EmailText,PasswordNum,ConfirmPasswordNum});

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

     
    /* static async sendOTPEmail(EmailText){
       const OTP = otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
       otpStore[EmailText] = { OTP, expires: Date.now() + 10 * 60 * 1000 };
       console.log(`Your OTP is ${OTP}`);

       // OAuth2 client setup
const oauth2Client = new google.auth.OAuth2(
  '73921812417-5vmpnvo4cvikejm7idhgnsoktu4u5r6q.apps.googleusercontent.com',   // Replace with your Google client ID
  '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',  // Replace with your Google client secret
  'http://localhost:5000/oauth2callback'  // Replace with your redirect URL
);

// Set credentials
oauth2Client.setCredentials({
  refresh_token: '1//046MSezgwdT7aCgYIARAAGAQSNwF-L9IrqQ45xaU_nHYIMYoXDFXtCg5GIjjgzEAq1mydAjANdoDufkGVQI06tMl4t_8S2Oku3RM'  // Replace with your refresh token
});

       const {AUTH_EMAIL,AUTH_PASS} = process.env
        const transporter = nodemailer.createTransport({
        port: 587,
        secure: false,
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: process.env.AUTH_EMAIL,  // Replace with your email
            pass: process.env.AUTH_PASS, 
            access_token: "ya29.a0ARW5m765elqiLNEGnaqHEMswi8K08itW_B_O2A2xQNGnadtfL2d2pgH-6NtPM3Fgg2qSy8cR8H5YsvcNRrM4UexZQCIq8-PdoHychXciLXLqa-p_NM1HXVrB4FWCMMVawXnmf_BUHuuDHXY_Ce-cACMHbzRkOhosPP6zOdGTaCgYKAa4SARMSFQHGX2MiOaGGjUvvC4IimPfx6vT31w0175",  // Replace with your email password
            refresh_token: "1//046MSezgwdT7aCgYIARAAGAQSNwF-L9IrqQ45xaU_nHYIMYoXDFXtCg5GIjjgzEAq1mydAjANdoDufkGVQI06tMl4t_8S2Oku3RM",
            clientId:'73921812417-5vmpnvo4cvikejm7idhgnsoktu4u5r6q.apps.googleusercontent.com',
            clientSecret:'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',
          },
          logger: true,  // Enable logging
          debug: true
        });
       //test transporter
        transporter.verify((error, success) => {
          if (error) {
            console.error('SMTP Transporter Error:', error);
          } else {
            console.log('SMTP connection is ready to send emails!');
          }
        });

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: EmailText,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is: ${OTP}`,
          };
        
          await transporter.sendMail(mailOptions);
          res.status(200).send('OTP sent to your email');
        } catch (error) {
          console.error(error);
          res.status(500).send('Error sending OTP');

         //Save otp record
         const hashOTP = async(generateOTP,saltRounds = 10)=>{
          try{
            const hashDta = await bcrypt.hash(generateOTP,saltRounds);
            return hashOTP;
          }catch(error){
            throw error;
          }
         }
         const newOTP =  new OTPModel({
          EmailText,
          otp : hashOTP,
          createAt : Date.now(),
          expireAt : Date.now() + 5*60*1000 ,
         });
          const createdOTPRecord = newOTP.save();
          return createdOTPRecord;

        }*/


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
      
          /*static async sendOTPEmail(EmailText,subject,message,duration=1){
            try{
             if(!EmailText && !subject && !message){
              throw Error("Provide value for email, subject, message ");
             }

             //clear any old record
             await OTPModel.deleteOne({EmailText});
             const OTP =generateOTP();

             //Send Email

            }catch(error){
             
            }
          }*/

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

        /*static async sendOTPEmail(params,callback){
          const otp = otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
          const ttl = 5*60*1000;
          const expires = Date.now() + ttl;
          const data = `${params.EmailText}.${otp}.${expires}`;
          const hash = crypto.createHmac("sha256",Key).update(data).digest("hex");
          const fullhash = `${hash}.${expires}`;
          console.log(`Your OTP is ${otp}`);

          //Send SMS
          return callback(null,fullhash);

        }*/

       /* static async verifyOTP(params,callback){
          console.log('params.hash:', params.hash);   
          if (!params.hash) {
          return res.status(400).json({ error: 'Missing or invalid hash' });
          }
         let [hashValue,expires] = params.hash.split('.');
         let now = Date.now();
         if(now > parseInt(expires)) return callback("OTP Expired");
          let data = `${params.EmailText}.${params.otp}.${expires}`;
          let newCalculateHash = crypto.createHmac("sha256",Key).update(data).digest("hex");

          if(newCalculateHash == hashValue){
            return callback(null,"Success");
          }
          return callback("Invalid OTP");
        }*/
}



module.exports = UserService;