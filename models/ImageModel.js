const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  userId: {
    type: String, // or mongoose.Schema.Types.ObjectId if using a full User model
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

const imageModel = mongoose.model('ProfileImage',imageSchema );

module.exports = imageModel;