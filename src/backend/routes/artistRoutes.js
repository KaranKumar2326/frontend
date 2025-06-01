const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const FeaturedArtist = require('../models/FeaturedArtist');

// Route to save artist to the database
router.post('/signup', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const { name, location, genre, experience, address, email, phone, password } = req.body;

  try {
    // Check if the artist already exists
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ success: false, message: 'Artist already exists' });
    }

    // Create a new artist
    const newArtist = new Artist({
      name,
      location,
      genre,
      experience,
      address,
      email,
      phone,
      password, // Note: Password should be hashed before saving in production
    });

    await newArtist.save();
    res.status(201).json({ success: true, message: 'Artist saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});


router.get('/featured', async (req, res) => {
  try {
    console.log('Fetching featured artists');
    const featuredArtists = await FeaturedArtist.find().limit(6);
    res.status(200).json(featuredArtists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured artists' });
  }
});

module.exports = router;