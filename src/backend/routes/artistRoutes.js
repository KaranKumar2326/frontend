const express = require('express');
const router = express.Router();
const Artist = require('../models/Artist');
const FeaturedArtist = require('../models/FeaturedArtist');
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

router.get('/featured', async (req, res) => {
  try {
    console.log('Fetching featured artists');
    const featuredArtists = await FeaturedArtist.find().limit(6);
    res.status(200).json(featuredArtists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured artists' });
  }
});

// Get a single artist by ID (from FeaturedArtist collection)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let artist = null;
    // Try to find by MongoDB ObjectId first
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      artist = await FeaturedArtist.findById(id);
    }
    // Fallback to legacy numerical id if not found
    if (!artist) {
      artist = await FeaturedArtist.findOne({ id: parseInt(id) });
    }
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update artist by ID (FeaturedArtist)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    let updatedArtist = null;
    // Try to update by ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedArtist = await FeaturedArtist.findByIdAndUpdate(id, update, { new: true });
    }
    // Fallback to legacy numerical id
    if (!updatedArtist) {
      updatedArtist = await FeaturedArtist.findOneAndUpdate({ id: parseInt(id) }, update, { new: true });
    }
    if (!updatedArtist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(updatedArtist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all artists (from FeaturedArtist collection)
router.get('/', async (req, res) => {
  try {
    const artists = await FeaturedArtist.find();
    res.status(200).json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artists' });
  }
});

// Get all global/featured artists (for /api/artists/global)
router.get('/global', async (req, res) => {
  try {
    const globalArtists = await FeaturedArtist.find();
    res.status(200).json(globalArtists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global artists' });
  }
});

// POST /api/artists/:id/upload-images
router.post('/:id/upload-images', upload.array('images'), async (req, res) => {
  try {
    const artistId = parseInt(req.params.id); // Always use custom numerical id
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
    let updateObj = {};
    if (type === 'banner') {
      updateObj.coverImage = link;
    } else {
      updateObj.imageUrl = link;
    }
    // Only update by custom numerical id in FeaturedArtist
    let artist = await FeaturedArtist.findOneAndUpdate(
      { id: artistId },
      updateObj,
      { new: true }
    );
    if (!artist) return res.status(404).json({ error: 'Artist not found in FeaturedArtist collection' });
    res.json(artist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;