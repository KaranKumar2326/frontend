import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Remove mockData import and use fetch for backend
// import { getArtistWithDetails, genres, instruments } from '../data/mockData';
import './ArtistProfilePage.css';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';

// Helper component for auto-resizing textarea
const AutoResizeTextarea = ({ value, onChange, className, readOnly }) => {
  const textareaRef = React.useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      className={className}
      readOnly={readOnly}
      style={{ minHeight: '100px' }}
    />
  );
};

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

const ArtistProfilePage = () => {
  const { _id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('General Information');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showInstrumentDropdown, setShowInstrumentDropdown] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editArtist, setEditArtist] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  // Define securitySlots before any useEffect that uses it
  const [securitySlots, setSecuritySlots] = useState([
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
    { questionIdx: '', answer: '' },
  ]);
  // securityAnswers is not used in the UI, but let's make it functional for future use:
  // We'll keep it in sync with securitySlots for possible future recovery flows.
  const [securityAnswers, setSecurityAnswers] = useState({});

  useEffect(() => {
    // Keep securityAnswers in sync with securitySlots
    const answersObj = {};
    securitySlots.forEach((slot, idx) => {
      if (slot.questionIdx && slot.answer) {
        answersObj[slot.questionIdx] = slot.answer;
      }
    });
    setSecurityAnswers(answersObj);
  }, [securitySlots]);
  const [securityError, setSecurityError] = useState(null);
  const [securitySuccess, setSecuritySuccess] = useState(null);
  const [editSocialLinks, setEditSocialLinks] = useState([]);
  const [socialLinksError, setSocialLinksError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}`);
        if (!res.ok) throw new Error('Artist not found.');
        const data = await res.json();
        setArtist(data);
        setSelectedGenres(data.genres ? data.genres.map(g => g.name) : []);
        setSelectedInstruments(data.instruments ? data.instruments.map(i => i.name) : []);
        setError(null);
      } catch (err) {
        setArtist(null);
        setError(err.message || 'Artist not found.');
      }
      setLoading(false);
    };
    fetchArtist();
  }, [_id]);

  useEffect(() => {
    // Fetch genres and instruments from backend
    const fetchMeta = async () => {
      try {
        const [genresRes, instrumentsRes] = await Promise.all([
          fetch('https://backend-musical.onrender.com/api/artists/genres'),
          fetch('https://backend-musical.onrender.com/api/artists/instruments'),
        ]);
        // Transform string arrays to objects with _id and name if API returns simple arrays
        const genresData = genresRes.ok ? await genresRes.json() : ['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop'];
        const instrumentsData = instrumentsRes.ok ? await instrumentsRes.json() : ['Guitar', 'Piano', 'Drums', 'Violin', 'Flute'];
        
        // Ensure genres and instruments have proper structure with unique IDs
        setGenres(Array.isArray(genresData) ? 
          genresData.map((g, idx) => typeof g === 'string' ? { _id: `genre-${idx}`, name: g } : g) : 
          genresData);
        
        setInstruments(Array.isArray(instrumentsData) ? 
          instrumentsData.map((i, idx) => typeof i === 'string' ? { _id: `instrument-${idx}`, name: i } : i) : 
          instrumentsData);
      } catch (e) {
        // Create proper objects with unique IDs for defaults
        setGenres(['Rock', 'Pop', 'Jazz', 'Classical', 'Hip-Hop'].map((g, idx) => ({ _id: `genre-${idx}`, name: g })));
        setInstruments(['Guitar', 'Piano', 'Drums', 'Violin', 'Flute'].map((i, idx) => ({ _id: `instrument-${idx}`, name: i })));
      }
    };
    fetchMeta();
  }, []);

  // When switching to edit mode, copy artist data
  useEffect(() => {
    if (isEditing && artist) {
      setEditArtist({ ...artist });
    }
  }, [isEditing, artist]);

  useEffect(() => {
    if (artist && artist.securityQuestions && Array.isArray(artist.securityQuestions)) {
      // Convert object or array to slots [{questionIdx, answer}]
      const slots = [];
      for (let i = 0; i < 5; i++) {
        if (artist.securityQuestions[i]) {
          slots.push({
            questionIdx: artist.securityQuestions[i].questionIdx,
            answer: artist.securityQuestions[i].answer,
          });
        } else {
          slots.push({ questionIdx: '', answer: '' });
        }
      }
      setSecuritySlots(slots);
    }
  }, [artist]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (field, value) => {
    setEditArtist(prev => ({ ...prev, [field]: value }));
  };

  const handleSecuritySlotChange = (slotIdx, field, value) => {
    setSecuritySlots(prev => prev.map((slot, idx) => idx === slotIdx ? { ...slot, [field]: value } : slot));
  };

  const handleSave = async () => {
    if (!editArtist) return;
    setLoading(true);
    try {
      const updatedArtist = {
        ...artist,
        ...editArtist,
        genres: genres.filter(g => selectedGenres.includes(g.name)),
        instruments: instruments.filter(i => selectedInstruments.includes(i.name)),
      };
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedArtist),
      });
      if (!res.ok) throw new Error('Failed to save changes.');
      const data = await res.json();
      setArtist(data);
      setIsEditing(false);
      setEditArtist(null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
    }
    setLoading(false);
  };

  const handleSaveSecurityQuestions = async () => {
    setSecurityError(null);
    setSecuritySuccess(null);
    // Validate: 5 unique questions, all answered
    const selected = securitySlots.filter(s => s.questionIdx !== '' && s.answer.trim() !== '');
    if (selected.length !== 5) {
      setSecurityError('Please select and answer exactly 5 questions.');
      return;
    }
    const questionSet = new Set(selected.map(s => s.questionIdx));
    if (questionSet.size !== 5) {
      setSecurityError('Please select 5 different questions.');
      return;
    }
    try {
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/security-questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          securityQuestions: securitySlots
            .filter(s => s.questionIdx !== '' && s.answer.trim() !== '')
            .map(s => ({ questionIdx: s.questionIdx, answer: s.answer })),
        }),
      });
      if (!res.ok) throw new Error('Failed to save security questions.');
      setSecuritySuccess('Security questions saved!');
      setTimeout(() => setSecuritySuccess(null), 2000);
    } catch (err) {
      setSecurityError(err.message || 'Failed to save security questions.');
    }
  };

  // Helper to convert Google Drive links to direct image links and proxy through backend
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

  // Helper to convert Google Drive links to direct video links and proxy through backend
  const getVideoSrc = (url) => {
    if (!url) return null;
    let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
    if (!match) {
      match = url.match(/[?&]id=([\w-]+)/);
    }
    let directUrl = url;
    if (match && match[1]) {
      directUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    // Always proxy through backend for CORS
    return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };

  const [showImageButtons, setShowImageButtons] = useState(false);
  const [showBannerButtons, setShowBannerButtons] = useState(false);
  const [showVideoButtons, setShowVideoButtons] = useState([false, false]); // For up to 2 videos
  const imageInputRef = React.useRef(null);
  const bannerInputRef = React.useRef(null);
  const videoInputRefs = [React.useRef(null), React.useRef(null)];

  // Helper for animated button style
  const actionBtnStyle = {
    background: '#fff',
    color: '#6c2bd9',
    border: '2px solid #6c2bd9',
    borderRadius: 8,
    padding: '0.5rem 1.5rem',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    marginBottom: 0
  };

  // Remove/replace/upload handlers for image
  const handleRemoveImage = async () => {
    setUploading(true);
    setUploadError(null);
    try {
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-image`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove image');
      const data = await res.json();
      setArtist(data);
      setUploadSuccess('Profile image removed!');
      setTimeout(() => setUploadSuccess(null), 2000);
    } catch (err) {
      setUploadError(err.message || 'Failed to remove image');
    }
    setUploading(false);
  };
  const handleTriggerImageInput = () => imageInputRef.current.click();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Always remove old image if exists
      if (artist.imageUrl) {
        await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-image`, { method: 'DELETE' });
      }
      const formData = new FormData();
      formData.append('images', file);
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/upload-images?type=profile`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setArtist(data);
      setUploadSuccess('Profile pic uploaded!');
      setTimeout(() => setUploadSuccess(null), 2000);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    }
    setUploading(false);
    e.target.value = '';
  };

  // Remove/replace/upload handlers for banner
  const handleRemoveBanner = async () => {
    setUploading(true);
    setUploadError(null);
    try {
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-banner`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove banner');
      const data = await res.json();
      setArtist(data);
      setUploadSuccess('Banner image removed!');
      setTimeout(() => setUploadSuccess(null), 2000);
    } catch (err) {
      setUploadError(err.message || 'Failed to remove banner');
    }
    setUploading(false);
  };
  const handleTriggerBannerInput = () => bannerInputRef.current.click();
  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Always remove old banner if exists
      if (artist.coverImage) {
        await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-banner`, { method: 'DELETE' });
      }
      const formData = new FormData();
      formData.append('images', file);
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/upload-images?type=banner`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setArtist(data);
      setUploadSuccess('Banner image uploaded!');
      setTimeout(() => setUploadSuccess(null), 2000);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    }
    setUploading(false);
    e.target.value = '';
  };

  // Remove/replace/upload handlers for videos
  const handleRemoveVideo = async (idx) => {
    setUploading(true);
    setUploadError(null);
    try {
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-video/${idx}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove video');
      const data = await res.json();
      setArtist(data);
      setUploadSuccess('Video removed!');
      setTimeout(() => setUploadSuccess(null), 2000);
    } catch (err) {
      setUploadError(err.message || 'Failed to remove video');
    }
    setUploading(false);
  };
  const handleTriggerVideoInput = (idx) => videoInputRefs[idx].current.click();
  const handleVideoChange = async (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      // Always remove old video if exists at this idx
      if (artist.videos && artist.videos[idx]) {
        await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-video/${idx}`, { method: 'DELETE' });
      }
      const formData = new FormData();
      formData.append('videos', file);
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/upload-videos`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setArtist(data);
      setUploadSuccess('Video uploaded!');
      setTimeout(() => setUploadSuccess(null), 2000);
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    }
    setUploading(false);
    e.target.value = '';
  };

  

  const handleSocialLinkChange = (idx, field, value) => {
    setEditSocialLinks(prev => {
      const arr = [...prev];
      if (!arr[idx]) arr[idx] = { platform: '', url: '' };
      arr[idx][field] = value;
      return arr;
    });
  };

  const handleSaveSocialLinks = async () => {
    setSocialLinksError(null);
    // Validate: at least 1, max 5, all with both platform and url
    const filtered = editSocialLinks.filter(l => l.platform.trim() && l.url.trim());
    if (filtered.length === 0) {
      setSocialLinksError('Please enter at least one social media link.');
      return;
    }
    if (filtered.length > 5) {
      setSocialLinksError('You can only add up to 5 links.');
      return;
    }
    try {
      const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/social-links`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialMediaLinks: filtered }),
      });
      if (!res.ok) throw new Error('Failed to save social media links.');
      const data = await res.json();
      setArtist(data);
      setIsEditing(false);
      setEditSocialLinks(filtered);
      setSocialLinksError(null);
    } catch (err) {
      setSocialLinksError(err.message || 'Failed to save social media links.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!artist) return <div>No artist found.</div>;

  return (
    <>
      <NavigationBar />
      {/* Show upload success/error messages */}
      {(uploadSuccess || uploadError) && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 30,
          zIndex: 9999,
          background: uploadSuccess ? '#d4edda' : '#f8d7da',
          color: uploadSuccess ? '#155724' : '#721c24',
          border: `1px solid ${uploadSuccess ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: 8,
          padding: '1rem 2rem',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {uploadSuccess || uploadError}
        </div>
      )}
      <div className="artist-profile-bg">
        <div className="artist-profile-card">
          {/* Left column with options */}
          <div className="artist-profile-left-menu">
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('General Information')}>General Information</div>
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('Insturments')}>Insturments</div>
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('Genres')}>Genres</div>
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('Booking Information')}>Booking Information</div>
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('Gallery')}>Gallery</div>
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('Social Media Links')}>Social Media Links</div>
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('Security Questions')}>Security Questions</div>
            <div className="artist-profile-left-menu-option" onClick={() => setSelectedMenu('Address')}>Address</div>
          </div>
          {/* Main profile content */}
          <div className="artist-profile-main-content">
            {selectedMenu === 'General Information' && (
              <>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Name</label>
                  <input className="artist-profile-input" type="text" value={isEditing ? editArtist?.name : artist.name} readOnly={!isEditing} onChange={e => handleInputChange('name', e.target.value)} />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Stage Name</label>
                  <input className="artist-profile-input" type="text" value={isEditing ? editArtist?.stageName : artist.stageName} readOnly={!isEditing} onChange={e => handleInputChange('stageName', e.target.value)} />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Experience </label>
                  <input className="artist-profile-input" type="text" value={isEditing ? editArtist?.exp : artist.exp} readOnly={!isEditing} onChange={e => handleInputChange('exp', e.target.value)} />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Bio</label>
                  <AutoResizeTextarea className="artist-profile-input" value={isEditing ? editArtist?.description : artist.description} readOnly={!isEditing} onChange={e => handleInputChange('description', e.target.value)} />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Location</label>
                  <input className="artist-profile-input" type="text" placeholder="e.g. Mumbai, Delhi, Online, etc." value={isEditing ? editArtist?.preferredLocation : artist.preferredLocation} readOnly={!isEditing} onChange={e => handleInputChange('preferredLocation', e.target.value)} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  {!isEditing && <button className="artist-profile-edit-btn" onClick={handleEdit}>Edit</button>}
                  {isEditing && <button className="artist-profile-save-btn" onClick={handleSave}>Save</button>}
                  {isEditing && <button className="artist-profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>}
                </div>
              </>
            )}
            {selectedMenu === 'Insturments' && (
              <>
                <label className="artist-profile-label">Instruments</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="artist-profile-input"
                    type="text"
                    value={selectedInstruments.join(', ')}
                    readOnly={!isEditing}
                    onFocus={isEditing ? () => setShowInstrumentDropdown(true) : undefined}
                    onBlur={isEditing ? () => setTimeout(() => setShowInstrumentDropdown(false), 150) : undefined}
                  />
                  {showInstrumentDropdown && isEditing && (
                    <div style={{
                      position: 'absolute',
                      top: '110%',
                      left: 0,
                      zIndex: 10,
                      background: '#fff',
                      border: '1px solid #eee',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      minWidth: '200px',
                      padding: '0.5rem 0',
                    }}>
                      {instruments.map(inst => (
                        <div
                          key={inst._id}
                          style={{ padding: '0.5rem 1rem', cursor: 'pointer', color: selectedInstruments.includes(inst.name) ? '#6c2bd9' : '#333', background: selectedInstruments.includes(inst.name) ? '#ede7fa' : 'transparent' }}
                          onMouseDown={e => {
                            e.preventDefault();
                            if (selectedInstruments.includes(inst.name)) {
                              setSelectedInstruments(selectedInstruments.filter(i => i !== inst.name));
                            } else {
                              setSelectedInstruments([...selectedInstruments, inst.name]);
                            }
                            // Close dropdown immediately after selection
                            setShowInstrumentDropdown(false);
                          }}
                        >
                          {inst.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  {!isEditing && <button className="artist-profile-edit-btn" onClick={handleEdit}>Edit</button>}
                  {isEditing && <button className="artist-profile-save-btn" onClick={handleSave}>Save</button>}
                  {isEditing && <button className="artist-profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>}
                </div>
              </>
            )}
            {selectedMenu === 'Genres' && (
              <>
                <label className="artist-profile-label">Genres</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="artist-profile-input"
                    type="text"
                    value={selectedGenres.join(', ')}
                    readOnly={!isEditing}
                    onFocus={isEditing ? () => setShowGenreDropdown(true) : undefined}
                    onBlur={isEditing ? () => setTimeout(() => setShowGenreDropdown(false), 150) : undefined}
                  />
                  {showGenreDropdown && isEditing && (
                    <div style={{
                      position: 'absolute',
                      top: '110%',
                      left: 0,
                      zIndex: 10,
                      background: '#fff',
                      border: '1px solid #eee',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      minWidth: '200px',
                      padding: '0.5rem 0',
                    }}>
                      {genres.map(genre => (
                        <div
                          key={genre._id}
                          style={{ padding: '0.5rem 1rem', cursor: 'pointer', color: selectedGenres.includes(genre.name) ? '#6c2bd9' : '#333', background: selectedGenres.includes(genre.name) ? '#ede7fa' : 'transparent' }}
                          onMouseDown={e => {
                            e.preventDefault();
                            if (selectedGenres.includes(genre.name)) {
                              setSelectedGenres(selectedGenres.filter(g => g !== genre.name));
                            } else {
                              setSelectedGenres([...selectedGenres, genre.name]);
                            }
                            // Close dropdown immediately after selection
                            setShowGenreDropdown(false);
                          }}
                        >
                          {genre.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  {!isEditing && <button className="artist-profile-edit-btn" onClick={handleEdit}>Edit</button>}
                  {isEditing && <button className="artist-profile-save-btn" onClick={handleSave}>Save</button>}
                  {isEditing && <button className="artist-profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>}
                </div>
              </>
            )}
            {selectedMenu === 'Booking Information' && (
              <>
                <label className="artist-profile-label">Price per hour</label>
                <input className="artist-profile-input" type="text" value={isEditing ? editArtist?.pricing : artist.pricing} readOnly={!isEditing} onChange={e => handleInputChange('pricing', e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  {!isEditing && <button className="artist-profile-edit-btn" onClick={handleEdit}>Edit</button>}
                  {isEditing && <button className="artist-profile-save-btn" onClick={handleSave}>Save</button>}
                  {isEditing && <button className="artist-profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>}
                </div>
              </>
            )}
            {selectedMenu === 'Gallery' && (
              <div
                style={{
                  height: '100%',
                  minHeight: 0,
                  width: '100%',
                  maxHeight: 'calc(100vh - 180px)', // Adjust for header/footer if needed
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  padding: '2rem 0',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                }}
              >
                {/* Profile Images Section */}
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '2rem', textAlign: 'center' }}>Profile Images</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                    {/* Profile Pic Upload */}
                    <div style={{ position: 'relative' }}>
                      <label style={{ fontWeight: 600, display: 'block', textAlign: 'center', marginBottom: 8 }}>Profile Pic</label>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                          src={artist.imageUrl ? getImageSrc(artist.imageUrl) : undefined}
                          alt="Profile"
                          className="artist-profile-img"
                          style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '18px', marginBottom: '0.5rem', background: '#eee', cursor: 'pointer' }}
                          onClick={() => setShowImageButtons(v => !v)}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: showImageButtons ? '0.7rem' : '0rem',
                            position: 'absolute',
                            left: '100%',
                            top: '50%',
                            transform: showImageButtons ? 'translateY(-50%) translateX(20px) scale(1)' : 'translateY(-50%) translateX(-40px) scale(0.2)',
                            opacity: showImageButtons ? 1 : 0,
                            pointerEvents: showImageButtons ? 'auto' : 'none',
                            zIndex: 2,
                            transition: 'opacity 0.3s cubic-bezier(.4,1.6,.6,1), transform 0.4s cubic-bezier(.4,1.6,.6,1), gap 0.3s',
                            boxShadow: showImageButtons ? '0 8px 32px 0 rgba(108,43,217,0.18)' : 'none',
                          }}
                        >
                          {artist.imageUrl && (
                            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={handleRemoveImage}>Remove</button>
                          )}
                          {artist.imageUrl && (
                            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={handleTriggerImageInput}>Replace</button>
                          )}
                          {!artist.imageUrl && (
                            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={handleTriggerImageInput}>Upload</button>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </div>
                    </div>
                    {/* Banner Upload */}
                    <div style={{ position: 'relative' }}>
                      <label style={{ fontWeight: 600, display: 'block', textAlign: 'center', marginBottom: 8 }}>Banner Image</label>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img
                          src={artist.coverImage ? getImageSrc(artist.coverImage) : undefined}
                          alt="Banner"
                          className="artist-profile-img"
                          style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '18px', marginBottom: '0.5rem', background: '#eee', cursor: 'pointer' }}
                          onClick={() => setShowBannerButtons(v => !v)}
                        />
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: showBannerButtons ? '0.7rem' : '0rem',
                            position: 'absolute',
                            left: '100%',
                            top: '50%',
                            transform: showBannerButtons ? 'translateY(-50%) translateX(20px) scale(1)' : 'translateY(-50%) translateX(-40px) scale(0.2)',
                            opacity: showBannerButtons ? 1 : 0,
                            pointerEvents: showBannerButtons ? 'auto' : 'none',
                            zIndex: 2,
                            transition: 'opacity 0.3s cubic-bezier(.4,1.6,.6,1), transform 0.4s cubic-bezier(.4,1.6,.6,1), gap 0.3s',
                            boxShadow: showBannerButtons ? '0 8px 32px 0 rgba(108,43,217,0.18)' : 'none',
                          }}
                        >
                          {artist.coverImage && (
                            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={handleRemoveBanner}>Remove</button>
                          )}
                          {artist.coverImage && (
                            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={handleTriggerBannerInput}>Replace</button>
                          )}
                          {!artist.coverImage && (
                            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={handleTriggerBannerInput}>Upload</button>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={bannerInputRef}
                          onChange={handleBannerChange}
                          style={{ display: 'none' }}
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Gallery Images Section */}
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '2rem', textAlign: 'center' }}>Gallery Images</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    maxWidth: '700px',
                    margin: '0 auto',
                  }}>
                    {[0, 1, 2, 3].map(idx => (
                      <GalleryImageUploader
                        key={idx}
                        idx={idx}
                        imageUrl={artist.galleryImages && artist.galleryImages[idx]}
                        uploading={uploading}
                        actionBtnStyle={actionBtnStyle}
                        onRemove={async () => {
                          setUploading(true);
                          setUploadError(null);
                          try {
                            const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-gallery-image/${idx}`, { method: 'DELETE' });
                            if (!res.ok) throw new Error('Failed to remove gallery image');
                            const data = await res.json();
                            setArtist(data);
                            setUploadSuccess('Gallery image removed!');
                            setTimeout(() => setUploadSuccess(null), 2000);
                          } catch (err) {
                            setUploadError(err.message || 'Failed to remove gallery image');
                          }
                          setUploading(false);
                        }}
                        onUpload={async (file) => {
                          setUploading(true);
                          setUploadError(null);
                          try {
                            // Always remove old gallery image if exists
                            if (artist.galleryImages && artist.galleryImages[idx]) {
                              await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/remove-gallery-image/${idx}`, { method: 'DELETE' });
                            }
                            const formData = new FormData();
                            formData.append('images', file);
                            const res = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}/upload-gallery-image/${idx}`, {
                              method: 'POST',
                              body: formData,
                            });
                            if (!res.ok) throw new Error('Upload failed');
                            const data = await res.json();
                            setArtist(data);
                            setUploadSuccess('Gallery image uploaded!');
                            setTimeout(() => setUploadSuccess(null), 2000);
                          } catch (err) {
                            setUploadError(err.message || 'Upload failed');
                          }
                          setUploading(false);
                        }}
                        getImageSrc={getImageSrc}
                        big
                      />
                    ))}
                  </div>
                </div>
                {/* Gallery Videos Section */}
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '2rem', textAlign: 'center' }}>Gallery Videos</h3>
                  <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    {[0, 1].map(idx => (
                      <div key={idx} style={{ position: 'relative', textAlign: 'center' }}>
                        <label style={{ fontWeight: 600, display: 'block', textAlign: 'center', marginBottom: 8 }}>{`Video ${idx + 1}`}</label>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          {artist.videos && artist.videos[idx] ? (
                            <video
                              src={getVideoSrc(artist.videos[idx])}
                              controls
                              style={{ width: '320px', height: '200px', borderRadius: '18px', background: '#000', cursor: 'pointer', marginBottom: '0.5rem' }}
                              onClick={() => setShowVideoButtons(v => {
                                const arr = [...v];
                                arr[idx] = !arr[idx];
                                return arr;
                              })}
                            />
                          ) : (
                            <div onClick={() => setShowVideoButtons(v => { const arr = [...v]; arr[idx] = !arr[idx]; return arr; })}
                              style={{ width: '320px', height: '200px', borderRadius: '18px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: '#bbb', cursor: 'pointer', marginBottom: '0.5rem', border: '2px dashed #ccc' }}>
                              +
                            </div>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              gap: showVideoButtons[idx] ? '0.7rem' : '0rem',
                              position: 'absolute',
                              left: '100%',
                              top: '50%',
                              transform: showVideoButtons[idx] ? 'translateY(-50%) translateX(20px) scale(1)' : 'translateY(-50%) translateX(-40px) scale(0.2)',
                              opacity: showVideoButtons[idx] ? 1 : 0,
                              pointerEvents: showVideoButtons[idx] ? 'auto' : 'none',
                              zIndex: 2,
                              transition: 'opacity 0.3s cubic-bezier(.4,1.6,.6,1), transform 0.4s cubic-bezier(.4,1.6,.6,1), gap 0.3s',
                              boxShadow: showVideoButtons[idx] ? '0 8px 32px 0 rgba(108,43,217,0.18)' : 'none',
                            }}
                          >
                            {artist.videos && artist.videos[idx] && (
                              <button type="button" style={actionBtnStyle} disabled={uploading} onClick={() => handleRemoveVideo(idx)}>Remove</button>
                            )}
                            {artist.videos && artist.videos[idx] && (
                              <button type="button" style={actionBtnStyle} disabled={uploading} onClick={() => handleTriggerVideoInput(idx)}>Replace</button>
                            )}
                            {(!artist.videos || !artist.videos[idx]) && (
                              <button type="button" style={actionBtnStyle} disabled={uploading} onClick={() => handleTriggerVideoInput(idx)}>Upload</button>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="video/*"
                            ref={videoInputRefs[idx]}
                            onChange={e => handleVideoChange(e, idx)}
                            style={{ display: 'none' }}
                            disabled={uploading}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </div>
            )}
            {selectedMenu === 'Social Media Links' && (
              <>
                <h2>Social Media</h2>
                {isEditing ? (
                  <form onSubmit={e => { e.preventDefault(); handleSaveSocialLinks(); }}>
                    {editSocialLinks.map((link, idx) => {
                      // Get all selected platforms except for this row
                      const selectedPlatforms = editSocialLinks.map((l, i) => i !== idx ? l.platform : null).filter(Boolean);
                      return (
                        <div key={idx} className="artist-profile-form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <select
                            className="artist-profile-input"
                            value={link.platform || ''}
                            onChange={e => handleSocialLinkChange(idx, 'platform', e.target.value)}
                            style={{ flex: 1 }}
                            required
                          >
                            <option value="">Select Platform</option>
                            <option value="Instagram" disabled={selectedPlatforms.includes('Instagram')}>Instagram</option>
                            <option value="Spotify" disabled={selectedPlatforms.includes('Spotify')}>Spotify</option>
                            <option value="Apple Music" disabled={selectedPlatforms.includes('Apple Music')}>Apple Music</option>
                            <option value="SoundCloud" disabled={selectedPlatforms.includes('SoundCloud')}>SoundCloud</option>
                            <option value="YouTube" disabled={selectedPlatforms.includes('YouTube')}>YouTube</option>
                          </select>
                          <input
                            className="artist-profile-input"
                            type="text"
                            placeholder="Profile URL"
                            value={link.url || ''}
                            onChange={e => handleSocialLinkChange(idx, 'url', e.target.value)}
                            maxLength={200}
                            style={{ flex: 2 }}
                            required
                          />
                        </div>
                      );
                    })}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <button type="submit" className="artist-profile-save-btn">Save</button>
                      {editSocialLinks.length < 5 && (
                        <button
                          type="button"
                          className="artist-profile-edit-btn"
                          onClick={() => setEditSocialLinks(prev => [...prev, { platform: '', url: '' }])}
                        >
                          Add
                        </button>
                      )}
                      <button type="button" className="artist-profile-cancel-btn" onClick={() => { setIsEditing(false); setEditSocialLinks(artist.socialMediaLinks && artist.socialMediaLinks.length > 0 ? artist.socialMediaLinks.map(l => ({ ...l })) : [{ platform: '', url: '' }]); setSocialLinksError(null); }}>Cancel</button>
                    </div>
                    {socialLinksError && <div style={{ color: 'red' }}>{socialLinksError}</div>}
                  </form>
                ) : (
                  artist.socialMediaLinks && artist.socialMediaLinks.length > 0 ? (
                    <div style={{ marginBottom: '1rem' }}>
                      {artist.socialMediaLinks.map((link, idx) => (
                        <div key={idx} className="artist-profile-form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                          <input className="artist-profile-input" type="text" value={link.platform || ''} readOnly style={{ flex: 1 }} />
                          <input className="artist-profile-input" type="text" value={link.url || ''} readOnly style={{ flex: 2 }} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No social media links available.</p>
                  )
                )}
                {!isEditing && (
                  <button className="artist-profile-edit-btn" onClick={() => {
                    setIsEditing(true);
                    setEditSocialLinks(
                      artist.socialMediaLinks && artist.socialMediaLinks.length > 0
                        ? artist.socialMediaLinks.map(l => ({ ...l }))
                        : [{ platform: '', url: '' }]
                    );
                  }}>Edit</button>
                )}
              </>
            )}
            {selectedMenu === 'Security Questions' && (
              <>
                <h2>Security Questions</h2>
                <p>Select and answer any 5 of the following questions. These will be used for account recovery.</p>
                {/* For debugging/future use: show current answers */}
                {Object.keys(securityAnswers).length > 0 && (
                  <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: 8 }}>
                    <b>Current Answers:</b> {Object.entries(securityAnswers).map(([idx, ans]) => `${SECURITY_QUESTIONS[idx]}: ${ans}`).join(' | ')}
                  </div>
                )}
                <form onSubmit={e => { e.preventDefault(); handleSaveSecurityQuestions(); }}>
                  {securitySlots.map((slot, idx) => (
                    <div key={idx} className="artist-profile-form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <select
                        className="artist-profile-input"
                        value={slot.questionIdx}
                        onChange={e => handleSecuritySlotChange(idx, 'questionIdx', e.target.value)}
                        required
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
                        className="artist-profile-input"
                        type="text"
                        placeholder="Your answer"
                        value={slot.answer}
                        onChange={e => handleSecuritySlotChange(idx, 'answer', e.target.value)}
                        maxLength={100}
                        required={!!slot.questionIdx}
                        disabled={!slot.questionIdx}
                      />
                    </div>
                  ))}
                  {securityError && <div style={{ color: 'red' }}>{securityError}</div>}
                  {securitySuccess && <div style={{ color: 'green' }}>{securitySuccess}</div>}
                  <button type="submit" className="artist-profile-save-btn">Save Answers</button>
                </form>
              </>
            )}
            {selectedMenu === 'Address' && (
              <>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Address Line 1</label>
                  <input
                    className="artist-profile-input"
                    type="text"
                    value={isEditing ? editArtist?.address : artist.address}
                    readOnly={!isEditing}
                    onChange={e => handleInputChange('address', e.target.value)}
                  />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">City</label>
                  <input
                    className="artist-profile-input"
                    type="text"
                    value={isEditing ? editArtist?.city : artist.city || ''}
                    readOnly={!isEditing}
                    onChange={e => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">State</label>
                  <input
                    className="artist-profile-input"
                    type="text"
                    value={isEditing ? editArtist?.state : artist.state || ''}
                    readOnly={!isEditing}
                    onChange={e => handleInputChange('state', e.target.value)}
                  />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Country</label>
                  <input
                    className="artist-profile-input"
                    type="text"
                    value={isEditing ? editArtist?.country : artist.country || ''}
                    readOnly={!isEditing}
                    onChange={e => handleInputChange('country', e.target.value)}
                  />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Pincode</label>
                  <input
                    className="artist-profile-input"
                    type="text"
                    value={isEditing ? editArtist?.pincode : artist.pincode || ''}
                    readOnly={!isEditing}
                    onChange={e => handleInputChange('pincode', e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                  {!isEditing && <button className="artist-profile-edit-btn" onClick={handleEdit}>Edit</button>}
                  {isEditing && <button className="artist-profile-save-btn" onClick={handleSave}>Save</button>}
                  {isEditing && <button className="artist-profile-cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArtistProfilePage;

// GalleryImageUploader component for gallery images
const GalleryImageUploader = ({ idx, imageUrl, uploading, actionBtnStyle, onRemove, onUpload, getImageSrc, big }) => {
  const inputRef = React.useRef(null);
  const [showButtons, setShowButtons] = React.useState(false);
  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <label style={{ fontWeight: 600, display: 'block', textAlign: 'center', marginBottom: 8 }}>{`Gallery Image ${idx + 1}`}</label>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {imageUrl ? (
          <img
            src={getImageSrc(imageUrl)}
            alt={`Gallery ${idx + 1}`}
            className="artist-profile-img"
            style={{ width: big ? '220px' : '120px', height: big ? '220px' : '120px', objectFit: 'cover', borderRadius: '14px', marginBottom: '0.5rem', background: '#eee', cursor: 'pointer' }}
            onClick={() => setShowButtons(v => !v)}
          />
        ) : (
          <div
            onClick={() => setShowButtons(v => !v)}
            style={{
              width: big ? '220px' : '120px',
              height: big ? '220px' : '120px',
              borderRadius: '14px',
              background: '#eee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: big ? '4rem' : '2.5rem',
              color: '#bbb',
              cursor: 'pointer',
              marginBottom: '0.5rem',
              border: '2px dashed #ccc',
              transition: 'border 0.2s',
            }}
          >
            +
          </div>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: showButtons ? '0.7rem' : '0rem',
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: showButtons ? 'translateY(-50%) translateX(20px) scale(1)' : 'translateY(-50%) translateX(-40px) scale(0.2)',
            opacity: showButtons ? 1 : 0,
            pointerEvents: showButtons ? 'auto' : 'none',
            zIndex: 2,
            transition: 'opacity 0.3s cubic-bezier(.4,1.6,.6,1), transform 0.4s cubic-bezier(.4,1.6,.6,1), gap 0.3s',
            boxShadow: showButtons ? '0 8px 32px 0 rgba(108,43,217,0.18)' : 'none',
          }}
        >
          {imageUrl && (
            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={onRemove}>Remove</button>
          )}
          {imageUrl && (
            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={() => inputRef.current && inputRef.current.click()}>Replace</button>
          )}
          {!imageUrl && (
            <button type="button" style={actionBtnStyle} disabled={uploading} onClick={() => inputRef.current && inputRef.current.click()}>Upload</button>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={e => {
            const file = e.target.files[0];
            if (file) onUpload(file);
            e.target.value = '';
          }}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </div>
    </div>
  );
};
