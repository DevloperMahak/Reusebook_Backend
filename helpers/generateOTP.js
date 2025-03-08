const otpGenerator = require('otp-generator');

const generateOTP = async()=>{
    try{
      const OTP = otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
      console.log(`Your OTP is ${OTP}`);
      return OTP
    }catch(error){
     throw error;
    }
};
module.exports = generateOTP;