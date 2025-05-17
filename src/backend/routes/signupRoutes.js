const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Signup route
router.post('/', async (req, res) => {
  const {
    name,
    email,
    password,
    geoLocation,
    genre,
    experience,
    address,
    phone,
    pincode
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user with all fields
    const newUser = new User({
      name,
      email,
      password,
      geoLocation,
      genre,
      experience,
      address,
      phone,
      pincode
    });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;