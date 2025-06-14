const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  //id: { type: Number, required: true, unique: true },
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
  //available: { type: Boolean, default: true }, // This field is not in the original schema 
  id: { type: Number, required: true, unique: true }, //
  stageName: { type: String, required: true }, //
  bio: { type: String }, //
  description: { type: String }, //
  location: { type: String }, 
  available: { type: Boolean, default: true },
  pricePerHour: { type: Number }, //
  pricing: { type: Number }, //
  pricingUnit: { type: String, default: 'hour' }, //
  rating: { type: Number }, // decimal
  coverImage: { type: String }, // check in frontennd for link type
  imageUrl: { type: String }, // check in frontennd for link type
  gallery: [{ type: String }], // array of image URLs
  genres: [genreSchema], //
  instruments: [instrumentSchema], // 
  userId: { type: Number },
  user: userSchema,
}, { timestamps: true });

module.exports = mongoose.model('FeaturedArtist', artistSchema);
