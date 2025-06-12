const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: false // Made optional
  },
  experience: {
    type: Number,
    required: false // Made optional
  },
  address: {
    type: String,
    required: false // Made optional
  },
  phone: {
    type: String,
    required: true
  },
  geoLocation: {
    type: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false }
    },
    required: false // Made optional
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);