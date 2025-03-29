const mongoose = require("mongoose");
const db = require('../config/db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { passwordReset } = require("../controllers/user.controller");

const {Schema} = mongoose;

const registerSchema = new mongoose.Schema({
  UserType: {
        type: String,
        enum: ["Student", "Shopkeeper"],
        required: true
      },
    FirstName:{
    type:String,
    require:true
   },
   LastName:{
    type:String,
    require:true
   },
   Address:{
    type:String,
    require:true
   },
   State:{
    type:String,
    require:true
   },
   City:{
    type:String,
    require:true
   },
   Gender: {
    type: String,
  },
     // Shopkeeper-specific fields
     ShopName: {
        type: String
      },
      OwnerName: {
        type: String
      },
      ShopCity: {
        type: String
      },
      ShopAddress: {
        type: String
      },
      ShopState: {
        type: String
      },
      Pincode:{
        type:String,
        require:true
       },
   PhNo:{
    type:String,
    require:true
   },
   WhatsappNo:{
    type:String,
    require:true
   },
   EmailText:{
    type:String,
    require:true
   },
   PasswordNum:{
    type:String,
    require:true
   },
   ConfirmPasswordNum:{
    type:String,
    require:true
   },
})

registerSchema.pre('save',async function() {
    try{
     var user = this;
     const salt = await(bcrypt.genSalt(10));
     const hashpass = await bcrypt.hash(user.PasswordNum,salt);

      user.PasswordNum = hashpass;

    }catch(error){
        throw(error)
    }
})


registerSchema.pre('save',async function() {
    try{
     var user = this;
     const salt = await(bcrypt.genSalt(10));
     const hashpass = await bcrypt.hash(user.ConfirmPasswordNum,salt);

      user.ConfirmPasswordNum = hashpass;

    }catch(error){
        throw(error)
    }
})

registerSchema.methods.comparePassword =async function(PasswordNum){
try{
const isMatch = await bcrypt.compare(PasswordNum,this.PasswordNum);
return isMatch;
}catch(err){
    throw err

}
}

/*registerSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    

    this.passwordResetToken = Math.floor(100000 + Math.random() * 900000);
    this.passwordResetTokenExpire = Date.now() + 10*60*1000;
    console.log(resetToken,this,this.passwordResetToken);
    return resetToken;
}*/

const registerModel = new mongoose.model("usersData",registerSchema);
module.exports = registerModel;