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
  password: { type: String, required: true }, // Assume already hashed
  fullName: { type: String, required: true },
  // Add more user fields as needed
});

const artistSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  stageName: { type: String, required: true },
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
  genres: [genreSchema],
  instruments: [instrumentSchema],
  userId: { type: Number },
  user: userSchema,
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);
