import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';

// Constants
const API_BASE_URL = 'https://backend-musical.onrender.com/api';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// Default user object
const DEFAULT_USER = {
  name: '',
  email: '',
  phone: '',
  pincode: '',
  genre: '',
  experience: 0,
  address: '',
  geoLocation: { latitude: 0, longitude: 0 },
  role: 'user',
  avgRating: 0,
  upcomingBookings: 0,
  imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
};

// Style constants
const inputStyle = (edit) => ({
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: edit ? '1.5px solid #6c2bd9' : '1.5px solid #eee',
  marginTop: 6,
  marginBottom: 2,
  fontSize: '1rem',
  background: edit ? '#f7f5fc' : '#f9f9f9',
  color: '#333',
});

const editBtnStyle = { 
  background: '#6c2bd9', 
  color: '#fff', 
  border: 'none', 
  borderRadius: 8, 
  padding: '0.7rem 1.5rem', 
  fontWeight: 600, 
  fontSize: '1rem', 
  cursor: 'pointer' 
};

const saveBtnStyle = { 
  background: '#fff', 
  color: '#6c2bd9', 
  border: '2px solid #6c2bd9', 
  borderRadius: 8, 
  padding: '0.7rem 1.5rem', 
  fontWeight: 600, 
  fontSize: '1rem', 
  cursor: 'pointer' 
};

const cancelBtnStyle = { 
  background: '#fff', 
  color: '#d92b2b', 
  border: '2px solid #d92b2b', 
  borderRadius: 8, 
  padding: '0.7rem 1.5rem', 
  fontWeight: 600, 
  fontSize: '1rem', 
  cursor: 'pointer' 
};

const ProfilePage = ({ onProfileUpdate }) => {
  const { userId: urlUserId } = useParams();
  const [user, setUser] = useState(DEFAULT_USER);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...DEFAULT_USER });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageState, setImageState] = useState({
    uploading: false,
    progress: 0,
    error: null,
    success: null
  });
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  
  // Get the userId from URL or localStorage
  const userId = urlUserId || localStorage.getItem('userId');

  // Memoized function to get auth headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }, []);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!userId) {
      toast.error('User not found. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load profile');
      }

      const userData = await response.json();
      setUser(userData);
      setForm(userData);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to load profile');
      toast.error(err.message || 'Failed to load profile');
      
      if (err.message.includes('401')) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [userId, navigate, getAuthHeaders]);

  useEffect(() => {
    const controller = new AbortController();
    fetchUserData();
    return () => controller.abort();
  }, [fetchUserData]);

  // Handle form changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('User not found. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(form)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setForm(updatedUser);
      setEdit(false);
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }
      
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Failed to update profile');
    }
  };

  // Validate file before upload
  const validateFile = (file) => {
    if (!file) {
      throw new Error('No file selected');
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG)');
    }
    
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image size should be less than 5MB');
    }
    
    return true;
  };

  // Upload profile image
  const uploadProfileImage = async (file) => {
    try {
      validateFile(file);
      
      setImageState({
        uploading: true,
        progress: 0,
        error: null,
        success: null
      });

      const formData = new FormData();
      formData.append('image', file);
      
      abortControllerRef.current = new AbortController();
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }
      
      const data = await response.json();
      
      setUser(prev => ({
        ...prev,
        imageUrl: data.imageUrl
      }));
      
      setForm(prev => ({
        ...prev,
        imageUrl: data.imageUrl
      }));
      
      setImageState(prev => ({
        ...prev,
        uploading: false,
        success: 'Profile picture updated successfully'
      }));
      
      if (onProfileUpdate) {
        onProfileUpdate({ ...user, imageUrl: data.imageUrl });
      }
      
      toast.success('Profile picture updated successfully');
    } catch (err) {
      console.error('Error uploading image:', err);
      setImageState(prev => ({
        ...prev,
        uploading: false,
        error: err.message || 'Failed to upload image'
      }));
      toast.error(err.message || 'Failed to upload image');
    }
  };

  // Handle image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      await uploadProfileImage(file);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Cancel upload
  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setImageState({
      uploading: false,
      progress: 0,
      error: null,
      success: null
    });
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <>
      <NavigationBar userProfilePic={user.imageUrl} showHomeInDropdown />
      <div style={{ 
        minHeight: '100vh', 
        background: '#f7f5fc', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        padding: '3rem 0',
        fontFamily: 'Montserrat, Arial, sans-serif'
      }}>
        {/* Left Profile Card */}
        <div style={{ 
          background: '#6c2bd9', 
          borderRadius: '24px', 
          width: 320, 
          minHeight: 520, 
          color: '#fff', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '2.5rem 1.5rem 2rem 1.5rem', 
          marginRight: 40, 
          marginLeft: 40, 
          boxShadow: '0 4px 24px rgba(108,43,217,0.10)'
        }}>
          {/* Profile Picture Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  border: '5px solid #fff', 
                  objectFit: 'cover',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }} 
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: '#fff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: imageState.uploading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }} 
                onClick={imageState.uploading ? handleCancelUpload : triggerFileInput}
              >
                <span style={{ fontSize: '18px', color: '#6c2bd9' }}>
                  {imageState.uploading ? '✕' : '📷'}
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
                disabled={imageState.uploading}
              />
            </div>
            
            {imageState.uploading && (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ 
                  height: '4px', 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '2px',
                  marginBottom: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${imageState.progress}%`,
                    height: '100%',
                    background: '#fff',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <small>Uploading... {Math.round(imageState.progress)}%</small>
              </div>
            )}
            
            {imageState.error && (
              <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '8px' }}>
                {imageState.error}
              </div>
            )}
            
            {imageState.success && (
              <div style={{ color: '#4caf50', fontSize: '14px', marginTop: '8px' }}>
                {imageState.success}
              </div>
            )}
          </div>
          
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6, fontFamily: 'Playfair Display, serif' }}>
            {user.name}
          </h2>
          
          <div style={{ fontSize: '1.1rem', marginBottom: 18 }}>
            {user.email}
          </div>
          
          <div style={{ 
            width: '100%', 
            background: '#fff', 
            borderRadius: 12, 
            color: '#6c2bd9', 
            padding: '1.1rem 1rem', 
            marginBottom: 18, 
            textAlign: 'center', 
            fontWeight: 600 
          }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 700 }}>
              {user.avgRating} <span style={{ fontSize: '1.1rem', fontWeight: 400 }}>/ 5</span>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>Avg. Rating</div>
          </div>
          
          <div style={{ 
            width: '100%', 
            background: '#fff', 
            borderRadius: 12, 
            color: '#6c2bd9', 
            padding: '1.1rem 1rem', 
            marginBottom: 18, 
            textAlign: 'center', 
            fontWeight: 600 
          }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 700 }}>
              {user.upcomingBookings}
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>Upcoming Bookings</div>
          </div>
          
          <div style={{ fontSize: '1rem', marginTop: 10, opacity: 0.85 }}>
            {user.address}
          </div>
        </div>
        
        {/* Right Editable Form */}
        <div style={{ 
          background: '#fff', 
          borderRadius: '18px', 
          boxShadow: '0 4px 24px rgba(108,43,217,0.08)', 
          padding: '2.5rem 2.5rem 2rem 2.5rem', 
          minWidth: 380, 
          flex: 1 
        }}>
          <h1 style={{
            color: '#6c2bd9',
            fontWeight: 800,
            fontSize: '2.6rem',
            marginBottom: '1.2rem',
            letterSpacing: '0.5px',
            fontFamily: 'Playfair Display, serif',
            textShadow: '0 2px 8px rgba(108,43,217,0.08)'
          }}>
            Welcome, <span style={{ fontFamily: 'Playfair Display, serif' }}>{user.name}</span>
          </h1>
          
          <form 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 18 
            }} 
            onSubmit={handleUpdateProfile}
          >
            <label>
              Name
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                disabled={!edit} 
                style={inputStyle(edit)} 
              />
            </label>
            
            <label>
              Email
              <input 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                disabled={!edit} 
                style={inputStyle(edit)} 
              />
            </label>
            
            <label>
              Phone
              <input 
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                disabled={!edit} 
                style={inputStyle(edit)} 
              />
            </label>
            
            <label>
              Pincode
              <input 
                name="pincode" 
                value={form.pincode} 
                onChange={handleChange} 
                disabled={!edit} 
                style={inputStyle(edit)} 
              />
            </label>
            
            <label>
              Genre
              <input 
                name="genre" 
                value={form.genre} 
                onChange={handleChange} 
                disabled={!edit} 
                style={inputStyle(edit)} 
              />
            </label>
            
            <label>
              Address
              <input 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                disabled={!edit} 
                style={inputStyle(edit)} 
              />
            </label>
            
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              {!edit && (
                <button 
                  type="button" 
                  style={editBtnStyle} 
                  onClick={() => setEdit(true)}
                >
                  Edit
                </button>
              )}
              
              {edit && (
                <button 
                  type="submit" 
                  style={saveBtnStyle}
                >
                  Save
                </button>
              )}
              
              {edit && (
                <button 
                  type="button" 
                  style={cancelBtnStyle} 
                  onClick={() => { 
                    setEdit(false); 
                    setForm(user); 
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

ProfilePage.propTypes = {
  onProfileUpdate: PropTypes.func
};

ProfilePage.defaultProps = {
  onProfileUpdate: null
};

export default ProfilePage;