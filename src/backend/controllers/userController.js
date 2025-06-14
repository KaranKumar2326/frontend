const User = require('../models/User');

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const { name, email, phone, pincode, genre, address, experience } = req.body;
        
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.pincode = pincode || user.pincode;
        user.genre = genre || user.genre;
        user.address = address || user.address;
        user.experience = experience || user.experience;

        const updatedUser = await user.save();
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Google Drive setup
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Google Drive credentials and setup
const DRIVE_FOLDER_ID = process.env.GDRIVE_FOLDER_ID || '1-guS2v8lJeHfQdS17N6hQgvNi1RSdogb';
const gdriveCreds = require('../gdrive-creds.json');
const auth = new google.auth.GoogleAuth({
  credentials: gdriveCreds,
  scopes: ['https://www.googleapis.com/auth/drive']
});
const drive = google.drive({ version: 'v3', auth });

// Helper to upload file to Google Drive and get shareable link
async function uploadToDrive(fileBuffer, filename) {
  try {
    const fileMetadata = {
      name: `${Date.now()}-${filename}`,
      parents: [DRIVE_FOLDER_ID],
    };

    // Create a temporary file
    const tempFilePath = path.join(__dirname, '../../uploads', filename);
    fs.writeFileSync(tempFilePath, fileBuffer);

    const media = {
      mimeType: 'image/jpeg',
      body: fs.createReadStream(tempFilePath),
    };

    // Upload to Google Drive
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
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
      fields: 'webViewLink,webContentLink',
    });

    // Clean up temporary file
    fs.unlinkSync(tempFilePath);

    return {
      webViewLink: result.data.webViewLink,
      webContentLink: result.data.webContentLink,
      directLink: `https://drive.google.com/uc?export=view&id=${file.data.id}`
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

// Upload profile image
const uploadProfileImage = async (req, res) => {
    console.log('=== Starting profile image upload ===');
    console.log('Request user:', req.user);
    console.log('Request file:', req.file ? `File received (${req.file.size} bytes)` : 'No file received');
    
    try {
        if (!req.file) {
            console.error('No file was uploaded');
            return res.status(400).json({ 
                success: false,
                message: 'No file uploaded' 
            });
        }

        // Get user ID from the authenticated request
        const userId = req.user.id || req.user._id;
        console.log('Uploading profile image for user ID:', userId);
        
        if (!userId) {
            console.error('No user ID found in request');
            return res.status(401).json({ 
                success: false,
                message: 'User not authenticated' 
            });
        }
        
        // Verify user exists before proceeding
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            console.error('User not found in database with ID:', userId);
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        console.log('User found, proceeding with Google Drive upload...');
        
        // Upload to Google Drive
        const result = await uploadToDrive(
            req.file.buffer,
            `profile-${userId}-${Date.now()}.jpg`
        );
        
        console.log('File uploaded to Google Drive, updating user record...');
        console.log('New image URL:', result.directLink);
        
        // Update user's imageUrl in the database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                imageUrl: result.directLink,
                profilePic: result.directLink // For backward compatibility
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).select('-password');

        if (!updatedUser) {
            console.error('Failed to update user with ID:', userId);
            return res.status(500).json({ 
                success: false,
                message: 'Failed to update user profile' 
            });
        }

        console.log('User profile image updated successfully');
        res.json({ 
            success: true,
            message: 'Image uploaded successfully',
            imageUrl: updatedUser.imageUrl || result.directLink
        });
    } catch (error) {
        console.error('Error in uploadProfileImage:', {
            error: error.message,
            stack: error.stack,
            name: error.name
        });
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        console.log('=== Profile image upload completed ===\n');
    }
};

module.exports = {
    getUserById,
    updateUser,
    uploadProfileImage
};
