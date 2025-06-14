const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Artist = require('../models/Artists');

// Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password, pincode, genre, experience, address, phone, geoLocation, role } = req.body;
  console.log("Signup request received with data:", req.body);
  try {
    // Check if the email already exists in the correct collection
    let existingUser;
    if (role === 'Artist') {
      existingUser = await Artist.findOne({ email });
    } else {
      existingUser = await User.findOne({ email });
    }
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'Artist') {
      newUser = new Artist({
        name,
        email,
        password: hashedPassword,
        pincode,
        genre,
        experience,
        address,
        phone,
        geoLocation
      });
    } else {
      newUser = new User({
        name,
        email,
        password: hashedPassword,
        pincode,
        genre,
        experience,
        address,
        phone,
        geoLocation
      });
    }

    // Save the user/artist to the database
    await newUser.save();

    // Generate a JWT token to authenticate the user
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User created successfully!',
      token,
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const normalizedRole = (role || '').toLowerCase();
    let user;
    if (normalizedRole === 'artist') {
      user = await Artist.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or role' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role: normalizedRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Login successful',
      token,
userId: user._id,
      email: user.email,
      name: user.name,
      role: normalizedRole,
      ...(normalizedRole === 'artist' && { 
        artistId: user._id,
        profileComplete : user.profileComplete
      })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Get role by email and userId
exports.getRole = async (req, res) => {
  const { email, userId } = req.query;
  if (!email || !userId) {
    return res.status(400).json({ message: 'Email and userId are required' });
  }
  try {
    // Try to find in User collection
    let user = await User.findOne({ email, _id: userId });
    if (user) {
      return res.json({ role: 'user' });
    }
    // Try to find in Artist collection
    let artist = await Artist.findOne({ email, _id: userId });
    if (artist) {
      return res.json({ role: 'artist' });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
