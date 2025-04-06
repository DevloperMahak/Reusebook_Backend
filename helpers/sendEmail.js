const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');


//const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
//oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

// Function to get the access token using the refresh token
async function getAccessToken() {
  const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  const { token } = await oAuth2Client.getAccessToken();
  return token;
}


async function sendMail(){
  try{
    const accesstoken = await getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: false,
        auth: {
          type: 'OAuth2',
          user: 'mgdeveloper02092005@gmail.com',  // Replace with your email
          clientId:CLIENT_ID,
          clientSecret:CLIENT_SECRET,
          access_token: accesstoken,  // Replace with your email password
          refresh_token: REFRESH_TOKEN,
        },
      });
     //test transporter
      transporter.verify((error, success) => {
        if (error) {
          console.error('SMTP Transporter Error:', error);
        } else {
          console.log('SMTP connection is ready to send emails!');
        }
      });
      const mailOptions ={
        from:'mgdeveloper02092005@gmail.com',
        to: 'mgdeveloper02092005@gmail.com',
        subject: 'Password Reset OTP',
       }
      const result = await transporter.sendMail(mailOptions);
      return result

  }catch(error){
    throw error
  }
}

  

/*const accesstoken = oAuth2Client.getAccessToken();

const {AUTH_EMAIL,AUTH_PASS} = process.env

        const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
          auth: {
            type: 'OAuth2',
            user: 'mgdeveloper02092005@gmail.com',  // Replace with your email
            clientId:CLIENT_ID,
            clientSecret:CLIENT_SECRET,
            access_token: accesstoken,  // Replace with your email password
            refresh_token: REFRESH_TOKEN,
          },
        });
       //test transporter
        transporter.verify((error, success) => {
          if (error) {
            console.error('SMTP Transporter Error:', error);
          } else {
            console.log('SMTP connection is ready to send emails!');
          }
        });
     
 const sendEmail = async()=>{
    try{
     await transporter.sendMail(mailOptions);
     return;
    }catch(error){
     throw error;
    }
 } */   
 
 module.exports = sendMail;