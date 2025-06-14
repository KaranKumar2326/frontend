const express = require('express');
const multer = require('multer');
const { 
  getUserById, 
  updateUser,
  uploadProfileImage 
} = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Test route
router.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'User routes are working!' });
});

// Get user by ID
router.get('/:id', auth, getUserById);

// Update user
router.put('/:id', auth, updateUser);

// Upload profile image
router.post('/upload-image', auth, upload.single('image'), uploadProfileImage);

module.exports = router;
