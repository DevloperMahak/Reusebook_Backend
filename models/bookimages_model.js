const mongoose = require('mongoose');

const bookimageSchema = new mongoose.Schema({
   imageData: Buffer,
  contentType: String,
});

const bookimageModel = mongoose.model('bookimages', bookimageSchema);

module.exports = bookimageModel;