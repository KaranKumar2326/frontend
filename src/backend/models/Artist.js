const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
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
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  coverImage: {
    type: String
  },
  imageUrl: {
    type: String
  },
  gallery: [{ type: String }] // array of image URLs
});

module.exports = mongoose.model('Artist', artistSchema);