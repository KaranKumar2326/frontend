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
const DRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID || '1I7HcpPlElt-0a9cTzMvx4UE1HcCtcxB4';
//const gdriveCreds = require('../gdrive-creds.json');
let value = 'ewogICAgInR5cGUiOiAic2VydmljZV9hY2NvdW50IiwKICAgICJwcm9qZWN0X2lkIjogIm11c2ljYWxtZWVldCIsCiAgICAicHJpdmF0ZV9rZXlfaWQiOiAiMWRhOWFiNGM1YjgxODNkZWRmNTRjNGI3YzMwMDFmOTAxNmI0NDliMCIsCiAgICAicHJpdmF0ZV9rZXkiOiAiLS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tXG5NSUlFdmdJQkFEQU5CZ2txaGtpRzl3MEJBUUVGQUFTQ0JLZ3dnZ1NrQWdFQUFvSUJBUUNlc2VVRGVYMTZVYzBJXG42LysyVjlkS21sZEhjNWtUS1lRY3gzMGlPaFBnV1lwK2J6b01VbkFGZ0V2RndMSnVhWUo2bHNuZ0N4SzlKOGlqXG5kWDJNVDhQT0U4bStJYTh1dzI5TVVFOENKbGdGNzRqVmxuNlpqcUY4UGVGT3c5N3lxbjdnVFp5ODRWVXlDTTJHXG5HRi9RYlhQL3VzUmN5OERkN3FjS0lORjVBcjdVVitENGtsY08yeGtTc3prQ29nZjRkdGtsbGVVYlh0YVdnTnZLXG5weEdlcWQrY0pvR3pwejNSVHJTRG1KWjE4WmwvZUVJWUdyUU1Wbk5xYUtYRlVUdTF4akp3NlZNdS9QNUF2ZE5HXG5jSXlsVGFOSUF2akFVVjFpQ3hXTTl3WDZMOGE0bkIyUEl3cDUxdHVaaFhqZnB2bE90eXdRREJqYWhXb3Joa0NZXG5KOWVKaHRKRkFnTUJBQUVDZ2dFQU95M2MyTlJiOGhzQ0tvTVRpM1NyY1FNb2JCbFVLcnl2S3lwTFpGR2pLdVZKXG5TOGYvcml1cDRhdEwxblY3Tk1oODQybEs1QlZOQ2lRRllzdUVJNmgxUE9yTkwyMlJUZytNZURsMGxUa21WeVJSXG44MUNaYW5zeGhrcnZNL2ZBTXQ5WXpCMjFSd3lDd0ZOZkRWUVdtdnZPSjc0R3p4SWVuTVNNSHk5STNtY2pNYnp5XG5yL2pnaDlZakRLc0xEaWgxL0JCb2dsa1UwYzlnK1VOdDdzNGl1MlU5b0ZOcDYxS2tiRzZxcStyVHZOVDRHTXFZXG5KN0hYbjR5R3hBdHViakNzeUhiTG1uYW53NnNpTVd1NGtrWWFhUFNteExRQUg2SVFSVXl6UzE3YXpMTVg0WlNxXG5ocFQ0V1lRaDlFUkwyMWN2T3orSTAydXpQYlBrTloyeW9pSmFhY1czR3dLQmdRRGV3TTJlbVRibzlualpHeGtQXG41d292V05YRUpHdkd3b1UzZTFIUmRSY2pRTTQ4U2Y4VXhWSVUxeURsS2JlTzh4VWlsWHp5aHZyZjhzOFFOUWt4XG4xWkhSb3NqWUJwSi9YZEtRbTZGYnlnMk4zUVB6QVNLd1A0ZzNkbFJHemVFYzMwbGVxNGIrQ2hGT0VkcjltOGZHXG5EVFBnZjBvZWxieVIrQi9CRnpFaTZ6Vk5Id0tCZ1FDMllYdmMyMzNrb1d6WnZ1aCtMV0N4NjUwYXQ3Q1Y0amJOXG5QT2JjYjdFczZlQW9wQjNJK0lOY1R5QlBUYzBQeUhnS3V2YzM0Sm8vdmJJUEdNTW1WRXFRSzNNbXc0NEZ4VHFiXG5nbnEyNnd1Mld1SVBzazZKWEFJSCsxamhzVDZpMkR1OGprd1c3V1EzTlRIaUlHNEhlM09pYnc5VDBiVGRYQXlLXG43djh4NVhKUUd3S0JnRGQyamp3VkxpVG5hY08xQ1pKNkZvRWZmMnB0SHlESVFsOUVKMlVkNEhyNG9lRkZFMnhhXG5qVXQvSFVPeUZYQlVla2k0Sy9vL1Bhd1JTeGxmKzBBYlMwbUZYTGpkT2hEWWpadFFCT2RUOGZnR3Rmc0ZwMXQzXG5GaldwRXVibVVFemVFK2lza05va0s1Yml2MEl5VFpXMHA5d1lGWjV6N2hYeVVBWEYvb2dSUko1RkFvR0JBSVI2XG5lVk9ycUY0TUdCcHZQMGh3UTkzWnJTdjhKR3dyZnUxRWdObTgxREV3emFBWDNuN2ViZVQrb1JTYUNndWQ3ZnkxXG5aT0NVNk5iR1AzSVI1YWVROFB5YVl6SFVPUFRlR0QxZjRTMi92S2xBaVJjbnlUNmpzK0lDWk1URVVDQlArOHh5XG5mTGpteGJZSWtPeVY2L2JKYU95anlibDBDZklGYkNMN2lpbS9abkxqQW9HQkFKVENSN2poQkdhMlZRUlo3cE1qXG5FOGxoRktCYXBuR2ZoMzFXU3dFSFJBd3JOLzZjalJOeTJSOFlFOFg1THNhV3NxQXY2TVo0Wjk2SVMydGMxaVRIXG55RW1hT3NjbzQzajd4a1Vzb0traCtadmdWRFdvNlRNYk43SXZ3YUVqd0NPR0c1MWViYllzcTV1dUhNbmFkNTVIXG4xbEswdm5NK0NqRWFmZWxubUNObXZEQjZcbi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS1cbiIsCiAgICAiY2xpZW50X2VtYWlsIjogIm11c2ljYWxtZWV0QG11c2ljYWxtZWVldC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgICAiY2xpZW50X2lkIjogIjExMzY5NjkxNjA3ODAzNDA1NzkxMCIsCiAgICAiYXV0aF91cmkiOiAiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLAogICAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgICAiY2xpZW50X3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9tdXNpY2FsbWVldCU0MG11c2ljYWxtZWVldC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgICAidW5pdmVyc2VfZG9tYWluIjogImdvb2dsZWFwaXMuY29tIgogIH0'
  
  const decoded = Buffer.from(value, 'base64').toString('utf8');
  
  // Option A: Write it to a temp file and use with Google APIs
  fs.writeFileSync('/tmp/gdrive-creds.json', decoded);
  
  // Option B: Parse directly as object
  const gdriveCreds = JSON.parse(decoded);
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