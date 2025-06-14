const express = require('express');
const { signup, login, getRole } = require('../controllers/authControllers');
const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get role by email and userId
router.get('/get-role', getRole);

module.exports = router;
