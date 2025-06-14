const JammingSession = require('../models/JammingSession');
const { validationResult } = require('express-validator');

// @desc    Get all jamming sessions
// @route   GET /api/jamming-sessions
// @access  Public
exports.getJammingSessions = async (req, res) => {
  try {
    const { location, genre, date, isPaid } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (genre) {
      filter.genre = genre;
    }
    
    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = {
        $gte: selectedDate,
        $lt: nextDay
      };
    }
    
    if (isPaid !== undefined) {
      filter.isPaid = isPaid === 'true';
    }
    
    const sessions = await JammingSession.find(filter)
      .populate('artist', 'name profilePicture')
      .sort({ date: 1 });
      
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single jamming session
// @route   GET /api/jamming-sessions/:id
// @access  Public
exports.getJammingSession = async (req, res) => {
  try {
    const session = await JammingSession.findById(req.params.id)
      .populate('artist', 'name profilePicture bio');
      
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a jamming session
// @route   POST /api/jamming-sessions
// @access  Private (Artist)
exports.createJammingSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      genre,
      maxCapacity,
      isPaid,
      price,
      coverImage
    } = req.body;
    
    const session = new JammingSession({
   
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      genre,
      maxCapacity,
      isPaid,
      price: isPaid ? price : 0,
      coverImage
    });
    
    await session.save();
    
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a jamming session
// @route   PUT /api/jamming-sessions/:id
// @access  Private (Artist)
exports.updateJammingSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    let session = await JammingSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if the logged in user is the artist who created the session
    if (session.artist.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      genre,
      maxCapacity,
      isPaid,
      price,
      coverImage
    } = req.body;
    
    session.title = title || session.title;
    session.description = description || session.description;
    session.date = date || session.date;
    session.startTime = startTime || session.startTime;
    session.endTime = endTime || session.endTime;
    session.location = location || session.location;
    session.genre = genre || session.genre;
    session.maxCapacity = maxCapacity || session.maxCapacity;
    session.isPaid = isPaid !== undefined ? isPaid : session.isPaid;
    session.price = isPaid ? price : 0;
    session.coverImage = coverImage || session.coverImage;
    
    await session.save();
    
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a jamming session
// @route   DELETE /api/jamming-sessions/:id
// @access  Private (Artist)
exports.deleteJammingSession = async (req, res) => {
  try {
    const session = await JammingSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if the logged in user is the artist who created the session
    if (session.artist.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await session.remove();
    
    res.json({ message: 'Session removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Join a jamming session
// @route   POST /api/jamming-sessions/:id/join
// @access  Private
exports.joinJammingSession = async (req, res) => {
  try {
    const session = await JammingSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Check if session is already full
    if (session.currentAttendees >= session.maxCapacity) {
      return res.status(400).json({ message: 'Session is already full' });
    }
    
    // Check if user is already attending (you might want to implement this)
    // if (session.attendees.includes(req.user.id)) {
    //   return res.status(400).json({ message: 'You are already attending this session' });
    // }
    
    session.currentAttendees += 1;
    await session.save();
    
    res.json({ message: 'Successfully joined the session', session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};