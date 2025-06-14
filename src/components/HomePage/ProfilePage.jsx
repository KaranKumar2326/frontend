import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';

const ProfilePage = () => {
  const { userId: urlUserId } = useParams();
  const [user, setUser] = useState({
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
    profilePic: 'https://randomuser.me/api/portraits/men/1.jpg' // Default profile picture
  });
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const profilePicInputRef = useRef(null);
  const navigate = useNavigate();
  
  // Get the userId from URL or localStorage
  const userId = urlUserId || localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('No user ID available');
      toast.error('User not found. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          const errorMsg = 'No authentication token found';
          console.error(errorMsg);
          toast.error('Please log in to view this profile');
          navigate('/login');
          return;
        }
        
        console.log('1. Starting to fetch user data...', { 
          hasToken: !!token, 
          userId: userId || 'No userId',
          tokenPreview: token ? `${token.substring(0, 10)}...` : 'No token'
        });

        // First, test the API endpoint directly
        console.log('2. Testing API endpoint...');
        try {
          const testResponse = await fetch('http://localhost:3001/api/users/test', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          const testData = await testResponse.text();
          console.log('2.1 Test API response:', {
            status: testResponse.status,
            statusText: testResponse.statusText,
            headers: Object.fromEntries(testResponse.headers.entries()),
            data: testData
          });
        } catch (testError) {
          console.error('2.2 Test API error:', {
            name: testError.name,
            message: testError.message,
            stack: testError.stack
          });
          throw new Error(`Cannot connect to API: ${testError.message}`);
        }

        // Now fetch the user data
        console.log('3. Making API request to fetch user data...');
        const apiUrl = `http://localhost:3001/api/users/${userId}`;
        console.log('4. API URL:', apiUrl);
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        console.log('4.1 Request details:', {
          method: 'GET',
          url: apiUrl,
          headers: {
            ...headers,
            'Authorization': `Bearer ${token.substring(0, 10)}...`
          },
          credentials: 'include'
        });

        let response;
        try {
          response = await fetch(apiUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: headers
          });
          console.log('5. Response received. Status:', response.status);
        } catch (fetchError) {
          console.error('5.1 Fetch error:', {
            name: fetchError.name,
            message: fetchError.message,
            stack: fetchError.stack
          });
          throw new Error(`Network error: ${fetchError.message}`);
        }
        
        let responseData;
        const responseText = await response.text();
        console.log('6. Raw response text:', responseText);
        
        try {
          responseData = responseText ? JSON.parse(responseText) : null;
          console.log('6.1 Parsed response data:', responseData);
        } catch (parseError) {
          console.error('6.2 Error parsing JSON response:', {
            error: parseError,
            status: response.status,
            statusText: response.statusText,
            responseText: responseText
          });
          throw new Error('Invalid response from server. Please try again later.');
        }

        if (!response.ok) {
          const errorMsg = responseData?.message || 
                         responseData?.error || 
                         `HTTP error! status: ${response.status} ${response.statusText}`;
          console.error('7. API Error:', { 
            status: response.status, 
            statusText: response.statusText,
            message: errorMsg,
            url: apiUrl,
            response: responseData
          });
          
          if (response.status === 401) {
            // Token might be expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            toast.error('Your session has expired. Please log in again.');
            navigate('/login');
            return;
          }
          
          throw new Error(errorMsg);
        }

        console.log('8. Successfully fetched user data:', responseData);
        setUser(responseData);
        setForm(responseData);
      } catch (error) {
        console.error('9. Error in fetchUserData:', {
          error: error.toString(),
          message: error.message,
          stack: error.stack
        });
        setError(error.message || 'Failed to load profile');
        toast.error(error.message || 'Failed to load profile');
      } finally {
        console.log('10. Setting loading to false');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.error('User not found. Please log in again.');
      navigate('/login');
      return;
    }

    try {
      console.log('Updating profile with data:', form);
      
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update error response:', errorData);
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log('Successfully updated user:', updatedUser);
      
      setUser(updatedUser);
      setForm(updatedUser);
      setEdit(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      toast.error(err.message || 'Failed to update profile');
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    handleUpdateProfile(e);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset progress and create new AbortController for this upload
    setUploadProgress(0);
    abortControllerRef.current = new AbortController();

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG)');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }


    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/users/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      
      // Update the user's image URL
      setUser(prev => ({ ...prev, imageUrl: data.imageUrl }));
      setForm(prev => ({ ...prev, imageUrl: data.imageUrl }));
      
      toast.success('Profile picture updated successfully');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error uploading image:', err);
        toast.error(err.message || 'Failed to upload image');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploading(false);
      setUploadProgress(0);
      toast.info('Upload cancelled');
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG)');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      if (!token || !userId) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Uploading profile picture for user ID:', userId);
      
      const response = await fetch('http://localhost:3001/api/users/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type when using FormData, let the browser set it with the correct boundary
        },
        body: formData,
        credentials: 'include' // Include cookies in the request
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Upload failed:', responseData);
        throw new Error(responseData.message || 'Failed to upload image');
      }
      
      if (!responseData.success) {
        throw new Error(responseData.message || 'Upload was not successful');
      }
      
      console.log('Profile picture updated successfully:', responseData);
      
      // Update the user's image URL
      const newImageUrl = responseData.imageUrl;
      if (newImageUrl) {
        setUser(prev => ({
          ...prev, 
          imageUrl: newImageUrl,
          profilePic: newImageUrl // Keep backward compatibility
        }));
        setForm(prev => ({
          ...prev, 
          imageUrl: newImageUrl,
          profilePic: newImageUrl // Keep backward compatibility
        }));
      }
      
      toast.success('Profile picture updated successfully');
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      const errorMessage = err.message || 'Failed to upload profile picture';
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
      // Reset file input to allow selecting the same file again
      if (profilePicInputRef.current) {
        profilePicInputRef.current.value = '';
      }
    }
  };

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
      <NavigationBar userProfilePic={user.profilePic} showHomeInDropdown />
      <div style={{ minHeight: '100vh', background: '#f7f5fc', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '3rem 0' }}>
        {/* Left vertical card */}
        <div style={{ background: '#6c2bd9', borderRadius: '24px', width: 320, minHeight: 520, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 1.5rem 2rem 1.5rem', marginRight: 40, marginLeft: 40, boxShadow: '0 4px 24px rgba(108,43,217,0.10)', fontFamily: 'Montserrat, Arial, sans-serif' }}>
          {/* Profile Picture Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img 
                src={user.imageUrl || user.profilePic} 
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
              <div style={{
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
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }} onClick={() => profilePicInputRef.current?.click()}>
                <span style={{ fontSize: '18px', color: '#6c2bd9' }}>📷</span>
              </div>
              <input
                type="file"
                ref={profilePicInputRef}
                onChange={handleProfilePicUpload}
                accept="image/*"
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </div>
            {uploading && (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ 
                  height: '4px', 
                  background: 'rgba(255,255,255,0.2)', 
                  borderRadius: '2px',
                  marginBottom: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: '#fff',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <small>Uploading... {Math.round(uploadProgress)}%</small>
              </div>
            )}
            {uploadError && (
              <div style={{ color: '#ff6b6b', fontSize: '14px', marginTop: '8px' }}>
                {uploadError}
              </div>
            )}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={uploading ? handleCancelUpload : triggerFileInput}
                disabled={uploading}
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  background: '#fff',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #6c2bd9',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  outline: 'none',
                  zIndex: 2
                }}
              >
                
              </button>
              {uploading && (
                <div style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: '2px solid #e0e0e0',
                  borderTopColor: '#6c2bd9',
                  animation: 'spin 1s linear infinite',
                  zIndex: 1
                }} />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </div>
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: 6, fontFamily: 'Playfair Display, serif' }}>{user.name}</h2>
          <div style={{ fontSize: '1.1rem', marginBottom: 18 }}>{user.email}</div>
          <div style={{ width: '100%', background: '#fff', borderRadius: 12, color: '#6c2bd9', padding: '1.1rem 1rem', marginBottom: 18, textAlign: 'center', fontWeight: 600 }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 700 }}>{user.avgRating} <span style={{ fontSize: '1.1rem', fontWeight: 400 }}>/ 5</span></div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>Avg. Rating</div>
          </div>
          <div style={{ width: '100%', background: '#fff', borderRadius: 12, color: '#6c2bd9', padding: '1.1rem 1rem', marginBottom: 18, textAlign: 'center', fontWeight: 600 }}>
            <div style={{ fontSize: '2.1rem', fontWeight: 700 }}>{user.upcomingBookings}</div>
            <div style={{ fontSize: '1rem', fontWeight: 500 }}>Upcoming Bookings</div>
          </div>
          <div style={{ fontSize: '1rem', marginTop: 10, opacity: 0.85 }}>{user.address}</div>
        </div>
        {/* Right editable fields */}
        <div style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 24px rgba(108,43,217,0.08)', padding: '2.5rem 2.5rem 2rem 2.5rem', minWidth: 380, flex: 1 }}>
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
          <form style={{ display: 'flex', flexDirection: 'column', gap: 18, fontFamily: 'Montserrat, Arial, sans-serif' }} onSubmit={handleSave}>
            <label>Name<input name="name" value={form.name} onChange={handleChange} disabled={!edit} style={inputStyle(edit)} /></label>
            <label>Email<input name="email" value={form.email} onChange={handleChange} disabled={!edit} style={inputStyle(edit)} /></label>
            <label>Phone<input name="phone" value={form.phone} onChange={handleChange} disabled={!edit} style={inputStyle(edit)} /></label>
            <label>Pincode<input name="pincode" value={form.pincode} onChange={handleChange} disabled={!edit} style={inputStyle(edit)} /></label>
            <label>Genre<input name="genre" value={form.genre} onChange={handleChange} disabled={!edit} style={inputStyle(edit)} /></label>
            <label>Address<input name="address" value={form.address} onChange={handleChange} disabled={!edit} style={inputStyle(edit)} /></label>
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              {!edit && <button type="button" style={editBtnStyle} onClick={() => setEdit(true)}>Edit</button>}
              {edit && <button type="submit" style={saveBtnStyle}>Save</button>}
              {edit && <button type="button" style={cancelBtnStyle} onClick={() => { setEdit(false); setForm(user); }}>Cancel</button>}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Add CSS animations
const styles = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  '.spin': {
    animation: 'spin 1s linear infinite',
  },
};

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
const editBtnStyle = { background: '#6c2bd9', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' };
const saveBtnStyle = { background: '#fff', color: '#6c2bd9', border: '2px solid #6c2bd9', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' };
const cancelBtnStyle = { background: '#fff', color: '#d92b2b', border: '2px solid #d92b2b', borderRadius: 8, padding: '0.7rem 1.5rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' };

export default ProfilePage;