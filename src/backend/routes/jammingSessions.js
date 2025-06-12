const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jammingSessionController = require('../controllers/jammingSessionController');
// const auth = require('../middlewares/authMiddleware'); // JWT authentication middleware

// @route   GET /api/jamming-sessions
// @desc    Get all jamming sessions
// @access  Public
router.get('/', jammingSessionController.getJammingSessions);

// @route   GET /api/jamming-sessions/:id
// @desc    Get single jamming session
// @access  Public
router.get('/:id', jammingSessionController.getJammingSession);

// @route   POST /api/jamming-sessions
// @desc    Create a jamming session
// @access  Private (Artist)
router.post(
  '/',
  [
    
    
      check('title', 'Title is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('startTime', 'Start time is required').not().isEmpty(),
      check('endTime', 'End time is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('genre', 'Genre is required').not().isEmpty(),
      check('maxCapacity', 'Maximum capacity is required').isInt({ min: 1 }),
      check('isPaid', 'Please specify if this is a paid session').isBoolean(),
      check('price', 'Price must be a positive number').if(
        check('isPaid').equals('true')
      ).isFloat({ min: 0 })
    
  ],
  jammingSessionController.createJammingSession
);

// @route   PUT /api/jamming-sessions/:id
// @desc    Update a jamming session
// @access  Private (Artist)
router.put(
  '/:id',
  [
    
      check('title', 'Title is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('startTime', 'Start time is required').not().isEmpty(),
      check('endTime', 'End time is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('genre', 'Genre is required').not().isEmpty(),
      check('maxCapacity', 'Maximum capacity is required').isInt({ min: 1 }),
      check('isPaid', 'Please specify if this is a paid session').isBoolean(),
      check('price', 'Price must be a positive number').if(
        check('isPaid').equals('true')
      ).isFloat({ min: 0 })
    
  ],
  jammingSessionController.updateJammingSession
);

// @route   DELETE /api/jamming-sessions/:id
// @desc    Delete a jamming session
// @access  Private (Artist)
router.delete('/:id', jammingSessionController.deleteJammingSession);

// @route   POST /api/jamming-sessions/:id/join
// @desc    Join a jamming session
// @access  Private
router.post('/:id/join', jammingSessionController.joinJammingSession);

module.exports = router;