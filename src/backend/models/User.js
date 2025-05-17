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
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  geoLocation: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);