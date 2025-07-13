import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import myImage from '../../public/defaultpic.png';
import PropTypes from 'prop-types';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';

// Constants
// const API_BASE_URL = 'https://backend-musical.onrender.com/api';
const API_BASE_URL = 'https://backend-musical.onrender.com/api';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

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

// Security questions
const SECURITY_QUESTIONS = [
  'What was your childhood nickname?',
  'What is the name of your favorite childhood friend?',
  'What was the name of your first pet?',
  'What was the first concert you attended?',
  'What is your mother’s maiden name?',
  'What is your favorite book?',
  'What is your favorite movie?',
  'What is the name of the street you grew up on?',
  'What is your favorite food?',
  'What city were you born in?'
];


const ProfilePage = ({ onProfileUpdate }) => {
  // State for showing image action buttons on hover
  const [showImageButtons, setShowImageButtons] = useState(false);
  const { userId: urlUserId } = useParams();
  const [user, setUser] = useState(null); // No default user
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null); // No default user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageState, setImageState] = useState({
    uploading: false,
    progress: 0,
    error: null,
    success: null
  });
  const [securitySlots, setSecuritySlots] = useState([
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
  ]);
  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState(null);
  const [genres, setGenres] = useState([]); // List of all genres from DB
  const [selectedGenres, setSelectedGenres] = useState([]); // Array of selected genre ObjectIds
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [genreSearch, setGenreSearch] = useState('');
  const genreDropdownRef = useRef(null);
  // Close dropdown on outside click
  useEffect(() => {
    if (!edit || !showGenreDropdown) return;
    const handleClick = (event) => {
      if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
        setShowGenreDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [edit, showGenreDropdown]);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  // Get the userId from URL or localStorage
  const userId = urlUserId || localStorage.getItem('userId');
  // Fetch genres from backend on mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/meta/genres`);
        if (res.ok) {
          const data = await res.json();
          setGenres(data);
        } else {
          setGenres([]);
        }
      } catch {
        setGenres([]);
      }
    };
    fetchGenres();
  }, []);

  // When user data loads, set selectedGenres from user.genres
  useEffect(() => {
    if (user && Array.isArray(user.genres)) {
      // user.genres may be array of objects or array of ids
      setSelectedGenres(user.genres.map(g => (typeof g === 'string' ? g : g._id)));
    }
  }, [user]);

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
      // Remove randomuser.me default if present
      if (userData.imageUrl && userData.imageUrl.includes('randomuser.me/api/portraits/')) {
        userData.imageUrl = '';
      }
      setUser(userData);
      setForm(userData);
      // Set securitySlots from userData.securityQuestions
      if (userData.securityQuestions && Array.isArray(userData.securityQuestions)) {
        const slots = [];
        for (let i = 0; i < 5; i++) {
          if (userData.securityQuestions[i]) {
            slots.push({
              questionIdx: userData.securityQuestions[i].questionIdx !== undefined && userData.securityQuestions[i].questionIdx !== null
                ? String(userData.securityQuestions[i].questionIdx)
                : '',
              answer: userData.securityQuestions[i].answer,
            });
          } else {
            slots.push({ questionIdx: '', answer: '' });
          }
        }
        setSecuritySlots(slots);
      }
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

  // (Removed duplicate security questions fetch. Now handled in fetchUserData.)


  // Handle form changes
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle genre selection (multi-select)
  const handleGenreChange = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
    setShowGenreDropdown(true);
  };

  // Remove genre chip
  const handleRemoveGenre = (genreId) => {
    setSelectedGenres(prev => prev.filter(id => id !== genreId));
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
      // Merge genres into form
      const updatedForm = { ...form, genres: selectedGenres };
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updatedForm)
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

      // After upload, fetch the latest user data to get the updated imageUrl from DB
      await fetchUserData();

      setImageState(prev => ({
        ...prev,
        uploading: false,
        success: 'Profile picture updated successfully'
      }));

      if (onProfileUpdate) {
        // Use the latest user data
        onProfileUpdate(user);
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

  // Cancel upload (unused, can be safely removed)

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Helper to convert Google Drive links to direct image links
  const getImageSrc = (url) => {
    if (!url) return null;
    let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
    if (!match) {
      match = url.match(/[?&]id=([\w-]+)/);
    }
    let directUrl = url;
    if (match && match[1]) {
      directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    // Always proxy through backend for CORS
    return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };

  console.log('ProfilePage user.imageUrl:', user?.imageUrl); // Debugging line

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

  // If user or form is not loaded, don't render the profile
  if (!user || !form) {
    return null;
  }

  const handleSecuritySlotChange = (slotIdx, field, value) => {
    setSecuritySlots(prev => prev.map((slot, idx) => idx === slotIdx ? { ...slot, [field]: value } : slot));
  };

  // Security questions logic (copied/adapted from ArtistProfilePage)
  const handleSaveSecurityQuestions = async () => {
    setSecurityError(null);
    setSecuritySuccess(null);
    // Always send exactly 5 security questions, all with valid questionIdx and answer
    const valid = securitySlots.every(s => s.questionIdx !== '' && s.answer.trim() !== '');
    if (!valid) {
      setSecurityError('Please select and answer exactly 5 questions.');
      return;
    }
    const questionSet = new Set(securitySlots.map(s => s.questionIdx));
    if (questionSet.size !== 5) {
      setSecurityError('Please select 5 different questions.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/security-questions`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          securityQuestions: securitySlots.map(s => ({ questionIdx: Number(s.questionIdx), answer: s.answer })),
        }),
      });
      if (!res.ok) throw new Error('Failed to save security questions.');
      const data = await res.json();
      // Update securitySlots with latest answers from backend
      if (data.user && Array.isArray(data.user.securityQuestions)) {
        const slots = [];
        for (let i = 0; i < 5; i++) {
          if (data.user.securityQuestions[i]) {
            slots.push({
              questionIdx: data.user.securityQuestions[i].questionIdx !== undefined && data.user.securityQuestions[i].questionIdx !== null
                ? String(data.user.securityQuestions[i].questionIdx)
                : '',
              answer: data.user.securityQuestions[i].answer,
            });
          } else {
            slots.push({ questionIdx: '', answer: '' });
          }
        }
        setSecuritySlots(slots);
      }
      setSecuritySuccess('Security questions saved!');
      setTimeout(() => setSecuritySuccess(null), 2000);
    } catch (err) {
      setSecurityError(err.message || 'Failed to save security questions.');
    }
  };

  return (
  <>
    <NavigationBar userProfilePic={user.imageUrl} showHomeInDropdown />
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f5fc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '3rem 0',
        fontFamily: 'Montserrat, Arial, sans-serif',
        flexWrap: 'wrap', // Added for responsiveness
        gap: '2rem', // Added for spacing between cards
      }}
    >
      {/* Left Profile Card */}
      <div
        style={{
          background: '#6c2bd9',
          borderRadius: '24px',
          width: 320,
          minHeight: 520,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2.5rem 1.5rem 2rem 1.5rem',
          margin: '0 20px', // Adjusted margin for better responsiveness
          boxShadow: '0 4px 24px rgba(108,43,217,0.10)',
          flexShrink: 0, // Prevent shrinking
        }}
      >
        {/* Profile Picture Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          {/* Profile image hover wrapper */}
          <div
            style={{ position: 'relative', marginBottom: '1rem' }}
            className="profile-image-action-wrapper"
          >
            <img
              src={user.imageUrl ? getImageSrc(user.imageUrl) : myImage}
              crossOrigin="anonymous"
              alt="Profile"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                border: '5px solid #fff',
                objectFit: 'cover',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                cursor: 'pointer',
              }}
              onClick={() => setShowImageButtons((v) => !v)}
            />
            {/* Show buttons only on hover */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: showImageButtons ? '0.7rem' : '0rem',
                position: 'absolute',
                left: '100%',
                top: '50%',
                transform: showImageButtons
                  ? 'translateY(-50%) translateX(20px) scale(1)'
                  : 'translateY(-50%) translateX(-40px) scale(0.2)',
                opacity: showImageButtons ? 1 : 0,
                pointerEvents: showImageButtons ? 'auto' : 'none',
                zIndex: 2,
                transition:
                  'opacity 0.3s cubic-bezier(.4,1.6,.6,1), transform 0.4s cubic-bezier(.4,1.6,.6,1), gap 0.3s',
                boxShadow: showImageButtons
                  ? '0 8px 32px 0 rgba(108,43,217,0.18)'
                  : 'none',
              }}
            >
              {user.imageUrl && (
                <button
                  type="button"
                  style={{
                    ...editBtnStyle,
                    background: '#fff',
                    color: '#6c2bd9',
                    border: '2px solid #6c2bd9',
                    padding: '0.5rem 1.5rem',
                    marginBottom: 0,
                    fontWeight: 700,
                  }}
                  disabled={imageState.uploading || !user.imageUrl}
                  onClick={async () => {
                    if (!user.imageUrl) return;
                    setImageState({ ...imageState, uploading: true, error: null, success: null });
                    try {
                      const token = localStorage.getItem('token');
                      const res = await fetch(`${API_BASE_URL}/users/${userId}/remove-image`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      if (!res.ok) throw new Error('Failed to remove image');
                      setUser((prev) => ({ ...prev, imageUrl: '' }));
                      setForm((prev) => ({ ...prev, imageUrl: '' }));
                      setImageState({ ...imageState, uploading: false, success: 'Profile image removed' });
                      localStorage.setItem('profileImageUpdated', Date.now());
                    } catch (err) {
                      setImageState({ ...imageState, uploading: false, error: err.message || 'Failed to remove image' });
                    }
                  }}
                >
                  Remove
                </button>
              )}
              {user.imageUrl && (
                <button
                  type="button"
                  style={{
                    ...editBtnStyle,
                    background: '#fff',
                    color: '#6c2bd9',
                    border: '2px solid #6c2bd9',
                    padding: '0.5rem 1.5rem',
                    marginBottom: 0,
                    fontWeight: 700,
                  }}
                  disabled={imageState.uploading}
                  onClick={() => triggerFileInput()}
                >
                  Replace
                </button>
              )}
              {!user.imageUrl && (
                <button
                  type="button"
                  style={{
                    ...editBtnStyle,
                    background: '#fff',
                    color: '#6c2bd9',
                    border: '2px solid #6c2bd9',
                    padding: '0.5rem 1.5rem',
                    marginBottom: 0,
                    fontWeight: 700,
                  }}
                  disabled={imageState.uploading}
                  onClick={() => triggerFileInput()}
                >
                  Upload
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                // Always remove old image from Google Drive if replacing
                if (user.imageUrl) {
                  try {
                    const token = localStorage.getItem('token');
                    await fetch(`${API_BASE_URL}/users/${userId}/remove-image`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` },
                    });
                  } catch {}
                }
                await handleImageChange(e);
              }}
              accept="image/*"
              style={{ display: 'none' }}
              disabled={imageState.uploading}
            />
          </div>
          {imageState.uploading && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div
                style={{
                  height: '4px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '2px',
                  marginBottom: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${imageState.progress}%`,
                    height: '100%',
                    background: '#fff',
                    transition: 'width 0.3s ease',
                  }}
                ></div>
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

        <h2
          style={{
             color : "White",
            fontWeight: 700,
            fontSize: '1.5rem',
            marginBottom: 6,
            fontFamily: 'Playfair Display, serif',
          }}
        >
          {user.name}
        </h2>

        <div style={{ fontSize: '1.1rem', marginBottom: 18 }}>{user.email}</div>

        <div
          style={{
            width: '100%',
            background: '#fff',
            borderRadius: 12,
            color: '#6c2bd9',
            padding: '1.1rem 1rem',
            marginBottom: 18,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
          <div style={{ fontSize: '2.1rem', fontWeight: 700 }}>
            {user.avgRating}{' '}
            <span style={{ fontSize: '1.1rem', fontWeight: 400 }}>/ 5</span>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 500 }}>Avg. Rating</div>
        </div>

        <div
          style={{
            width: '100%',
            background: '#fff',
            borderRadius: 12,
            color: '#6c2bd9',
            padding: '1.1rem 1rem',
            marginBottom: 18,
            textAlign: 'center',
            fontWeight: 600,
          }}
        >
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
      <div
        style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 4px 24px rgba(108,43,217,0.08)',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          minWidth: 380,
          flex: 1,
          margin: '0 20px', // Adjusted margin for better responsiveness
          maxWidth: 'calc(100% - 40px)', // Ensure it doesn't overflow on small screens
        }}
      >
        <h1
          style={{
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
              Genres
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  marginTop: 2
                }}
                ref={genreDropdownRef}
              >
                <div
                  style={{
                    border: edit ? '1.5px solid #6c2bd9' : '1.5px solid #eee',
                    borderRadius: '6px',
                    background: edit ? '#f7f5fc' : '#f9f9f9',
                    minHeight: '44px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 10px',
                    cursor: edit ? 'pointer' : 'default',
                    opacity: edit ? 1 : 0.7,
                  }}
                  onClick={() => edit && setShowGenreDropdown(v => !v)}
                >
                  {selectedGenres.length === 0 && (
                    <span style={{ color: '#aaa', fontSize: '1rem' }}>
                      {edit ? 'Select genres...' : 'No genres selected'}
                    </span>
                  )}
                  {selectedGenres.map(id => {
                    const genre = genres.find(g => g._id === id);
                    if (!genre) return null;
                    return (
                      <span
                        key={id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#6c2bd9',
                          color: '#fff',
                          borderRadius: '16px',
                          padding: '2px 10px 2px 10px',
                          fontWeight: 600,
                          fontSize: '0.98rem',
                          margin: '2px 2px',
                          cursor: edit ? 'pointer' : 'default',
                        }}
                      >
                        {genre.name}
                        {edit && (
                          <span
                            onClick={e => {
                              e.stopPropagation();
                              handleRemoveGenre(id);
                            }}
                            style={{
                              marginLeft: 6,
                              fontWeight: 900,
                              fontSize: '1.1em',
                              cursor: 'pointer',
                              color: '#fff',
                              paddingLeft: 2
                            }}
                          >×</span>
                        )}
                      </span>
                    );
                  })}
                </div>
                {/* Dropdown */}
                {edit && showGenreDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '110%',
                      left: 0,
                      width: '100%',
                      background: '#fff',
                      border: '1.5px solid #6c2bd9',
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px rgba(108,43,217,0.10)',
                      zIndex: 10,
                      maxHeight: 220,
                      overflowY: 'auto',
                      padding: '8px 0',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search genres..."
                      value={genreSearch}
                      onChange={e => setGenreSearch(e.target.value)}
                      style={{
                        width: '92%',
                        margin: '0 4%',
                        marginBottom: 6,
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid #eee',
                        fontSize: '1rem',
                        outline: 'none',
                        background: '#f7f5fc',
                      }}
                      autoFocus
                    />
                    {genres
                      .filter(g => g.name.toLowerCase().includes(genreSearch.toLowerCase()))
                      .map(genre => (
                        <div
                          key={genre._id}
                          style={{
                            padding: '7px 18px',
                            cursor: 'pointer',
                            background: selectedGenres.includes(genre._id)
                              ? 'rgba(108,43,217,0.08)'
                              : '#fff',
                            color: '#6c2bd9',
                            fontWeight: selectedGenres.includes(genre._id) ? 700 : 500,
                            fontSize: '1.05rem',
                            borderBottom: '1px solid #f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            handleGenreChange(genre._id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre._id)}
                            readOnly
                            style={{ marginRight: 10 }}
                          />
                          {genre.name}
                        </div>
                      ))}
                    {genres.filter(g => g.name.toLowerCase().includes(genreSearch.toLowerCase())).length === 0 && (
                      <div style={{ color: '#aaa', padding: '8px 18px' }}>No genres found</div>
                    )}
                  </div>
                )}
              </div>
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
      
      {/* Security Questions Section */}
      <div style={{
        background: '#f7f5fc',
        border: '1.5px solid #6c2bd9',
        borderRadius: 16,
        padding: '2rem',
        marginTop: 32,
        marginBottom: 32,
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
        boxSizing: 'border-box', // Ensure padding is included in width
        width: 'calc(100% - 40px)', // Adjusted width for responsiveness
      }}
    >
      <h2 style={{ color: '#6c2bd9', fontWeight: 700, marginBottom: 18 }}>
        Security Questions
      </h2>
      <p>Select and answer any 5 of the following questions. These will be used for account recovery.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveSecurityQuestions();
        }}
      >
        {securitySlots.map((slot, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem',
              flexWrap: 'wrap', // Added for responsiveness
            }}
          >
            <select
              className="profile-input"
              value={slot.questionIdx}
              onChange={(e) => handleSecuritySlotChange(idx, 'questionIdx', e.target.value)}
              required
              style={{ width: 'calc(60% - 0.5rem)', minWidth: '150px', flexGrow: 1 }} 
            >
              <option value="">Select a question</option>
              {SECURITY_QUESTIONS.map((q, qIdx) => (
                <option
                  key={qIdx}
                  value={qIdx}
                  disabled={securitySlots.some((s, sIdx) => sIdx !== idx && s.questionIdx === String(qIdx))}
                >
                  {q}
                </option>
              ))}
            </select>
            <input
              className="profile-input"
              type="text"
              placeholder="Your answer"
              value={slot.answer}
              onChange={(e) => handleSecuritySlotChange(idx, 'answer', e.target.value)}
              maxLength={100}
              required={!!slot.questionIdx}
              disabled={!slot.questionIdx}
              style={{ width: 'calc(40% - 0.5rem)', minWidth: '150px', flexGrow: 1 }} 
            />
          </div>
        ))}
        {securityError && <div style={{ color: 'red' }}>{securityError}</div>}
        {securitySuccess && <div style={{ color: 'green' }}>{securitySuccess}</div>}
        <button type="submit" style={{ ...saveBtnStyle, marginTop: 16 }}>
          Save Security Questions
        </button>
      </form>
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