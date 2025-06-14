const express = require('express');
const router = express.Router();
const Artist = require('../models/Artists')
const multer = require('multer');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Google Drive setup
const DRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID || '1-guS2v8lJeHfQdS17N6hQgvNi1RSdogb';
const gdriveCreds = require('../gdrive-creds.json');
const auth = new google.auth.GoogleAuth({
  credentials: gdriveCreds,
  scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

// Helper to upload file to Google Drive and get shareable link
async function uploadToDrive(filePath, filename) {
  const fileMetadata = {
    name: filename,
    parents: [DRIVE_FOLDER_ID],
  };
  const media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream(filePath),
  };
  const file = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id',
  });
  // Make file public
  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: { role: 'reader', type: 'anyone' },
  });
  // Get shareable link
  const result = await drive.files.get({
    fileId: file.data.id,
    fields: 'webContentLink',
  });
  return result.data.webContentLink;
}

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

// Get featured artists (top 6 artists with highest rating)
router.get('/featured', async (req, res) => {
  try {
    console.log('Fetching featured artists');
    const Artists = await Artist.find({ rating: { $exists: true } })
      .sort({ rating: -1 })
      .limit(6);
    res.status(200).json(Artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// Get all artists with optional search query
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};
    
    if (q) {
      query.$or = [
        { stageName: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { 'genres.name': { $regex: q, $options: 'i' } },
        { 'instruments.name': { $regex: q, $options: 'i' } }
      ];
    }
    
    const artists = await Artist.find(query);
    res.status(200).json(artists);
  } catch (error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// Get a single artist by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let artist = null;
    
    // Try to find by MongoDB ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      artist = await Artist.findById(id);
    } else {
      // Try to find by legacy numerical id if not found by ObjectId
      artist = await Artist.findOne({ userId: id });
    }
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update artist by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    let updatedArtist = null;
    
    // Try to update by ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedArtist = await Artist.findByIdAndUpdate(id, update, { new: true });
    } else {
      // Try to update by userId if not found by ObjectId
      updatedArtist = await Artist.findOneAndUpdate(
        { userId: parseInt(id) },
        update,
        { new: true }
      );
    }
    
    if (!updatedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    
    res.json(updatedArtist);
  } catch (error) {
    console.error('Error updating artist:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all global/featured artists (same as featured but with different endpoint for backward compatibility)
router.get('/global', async (req, res) => {
  try {
    const globalArtists = await Artist.find({ rating: { $exists: true } })
      .sort({ rating: -1 })
      .limit(6);
    res.status(200).json(globalArtists);
  } catch (error) {
    console.error('Error fetching global artists:', error);
    res.status(500).json({ error: 'Failed to fetch global artists' });
  }
});

// Upload images for artist
router.post('/:id/upload-images', upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;
    const type = req.query.type || 'profile'; // 'profile' or 'banner'
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Upload the first file to Google Drive
    const file = files[0];
    const link = await uploadToDrive(file.path, file.originalname);
    fs.unlinkSync(file.path); // Remove local file after upload
    
    // Prepare update object
    const updateObj = type === 'banner' 
      ? { coverImage: link }
      : { imageUrl: link };
    
    // Find and update artist
    let artist = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      artist = await Artist.findByIdAndUpdate(id, updateObj, { new: true });
    } else {
      artist = await Artist.findOneAndUpdate(
        { userId: parseInt(id) },
        updateObj,
        { new: true }
      );
    }
    
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    res.json(artist);
  } catch (err) {
    console.error('Error uploading artist image:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;