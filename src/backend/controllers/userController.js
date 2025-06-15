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
