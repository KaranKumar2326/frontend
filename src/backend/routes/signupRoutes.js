// const express = require('express');
// const User = require('../models/User');

// const router = express.Router();

// // Signup route
// router.post('/signup', async (req, res) => {
//   const {
//     name,
//     email,
//     password,
//     geoLocation,
//     genre,
//     experience,
//     address,
//     phone,
//     pincode
//   } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create new user with all fields
//     const newUser = new User({
//       name,
//       email,
//       password,
//       geoLocation,
//       genre,
//       experience,
//       address,
//       phone,
//       pincode
//     });
//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully', success: true });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// // Login route
// router.post('/login', async (req, res) => {
//   const { emailOrPhone, password } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({
//       $or: [
//         { email: emailOrPhone },
//         { phone: emailOrPhone }
//       ]
//     });

//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid credentials', success: false });
//     }

//     res.status(200).json({ message: 'Login successful', success: true });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// module.exports = router;








const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, pincode, genre, experience, address, phone, geoLocation } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      pincode,
      genre,
      experience,
      address,
      phone,
      geoLocation,
    });

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: 'user' },  // Adjust 'role' as necessary for your system
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
