const mongoose = require("mongoose");
const db = require('../config/db');
const { file } = require("googleapis/build/src/apis/file");

const {Schema} = mongoose;

const postedbookSchema = new mongoose.Schema({
    BookName:{
    type:String,
    require:true
   },
   BookDescription:{
    type:String,
    require:true
   },
   Publication:{
    type:String,
    require:true
   },
   Author:{
    type:String,
    require:true
   },
   PrintedPrice:{
    type:String,
    require:true
   },
   SellingPrice:{
    type:String,
    require:true
   },
})



const postedbookModel = new mongoose.model("postedbookData",postedbookSchema);
module.exports = postedbookModel;

/*frontimage:{
    type:String,
    default:""
   },
   backimage:{
    type:String,
    default:""
   },*/