const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup Controller
exports.signup = async (req, res) => {
    
  const { name, email, password, pincode, genre, experience, address, phone, geoLocation } = req.body;

//   console .log(req.body);
    console.log("Signup request received with data:", req.body);
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the user's password before storing it in the database
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

    // Generate a JWT token to authenticate the user
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email }, // Payload for the JWT token
      process.env.JWT_SECRET, // The secret key to sign the token
      { expiresIn: '1h' } // Set the token to expire in 1 hour
    );

    // Send the response with the token
    res.status(201).json({
      message: 'User created successfully!',
      token,
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name, // Include the user's name in the response
    });
  } catch (error) {
    // Handle server errors
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body; // Include role in the request body

  try {
    // Find the user by email and role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or role' });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token if the password matches
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role: user.role }, // Include role in the payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Set the token to expire in 1 hour
    );

    // Send the response with the token
    res.json({
      message: 'Login successful',
      token,
      userId: user._id,
      email: user.email,
      name: user.name, // Include the user's name in the response
      role: user.role, // Include the user's role in the response
    });
  } catch (error) {
    // Handle server errors
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};
