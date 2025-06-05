const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: 'user' },  // Adjust 'role' as necessary
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send response with token
    res.json({ message: 'Login successful  arjun', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
