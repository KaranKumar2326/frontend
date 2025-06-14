const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const instrumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
});

const artistSchema = new mongoose.Schema({
  // Original Artist fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  
  // Fields from FeaturedArtist
  stageName: { type: String },
  bio: { type: String },
  description: { type: String },
  location: { type: String },
  available: { type: Boolean, default: true },
  pricePerHour: { type: Number },
  pricing: { type: Number },
  pricingUnit: { type: String, default: 'hour' },
  rating: { type: Number },
  coverImage: { type: String },
  imageUrl: { type: String },
  gallery: [{ type: String }],
  genres: [genreSchema],
  instruments: [instrumentSchema],
  userId: { type: Number },
  user: userSchema,
  
  
  experience: { type: Number },
  address: { type: String },
  geoLocation: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['artist'],
    default: 'artist',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);