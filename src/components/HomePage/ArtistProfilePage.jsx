import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Remove mockData import and use fetch for backend
// import { getArtistWithDetails, genres, instruments } from '../data/mockData';
import './ArtistProfilePage.css';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';

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
          fetch('https://backend-musical.onrender.com/api/genres'),
          fetch('https://backend-musical.onrender.com/api/instruments'),
        ]);
        const genresData = genresRes.ok ? await genresRes.json() : [];
        const instrumentsData = instrumentsRes.ok ? await instrumentsRes.json() : [];
        setGenres(genresData);
        setInstruments(instrumentsData);
      } catch (e) {
        setGenres([]);
        setInstruments([]);
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (field, value) => {
    setEditArtist(prev => ({ ...prev, [field]: value }));
  };
  // THIS TOOO
  const handleSave = async () => {
    if (!editArtist) return;
    setLoading(true);
    try {
      const updatedArtist = {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!artist) return <div>No artist found.</div>;

  return (
    <>
      <NavigationBar />
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
          </div>
          {/* Main profile content */}
          <div className="artist-profile-main-content">
            {selectedMenu === 'General Information' && (
              <>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Name</label>
                  <input className="artist-profile-input" type="text" value={isEditing ? editArtist?.stageName : artist.stageName} readOnly={!isEditing} onChange={e => handleInputChange('stageName', e.target.value)} />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Bio</label>
                  <AutoResizeTextarea className="artist-profile-input" value={isEditing ? editArtist?.description : artist.description} readOnly={!isEditing} onChange={e => handleInputChange('description', e.target.value)} />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Location</label>
                  <input className="artist-profile-input" type="text" value={isEditing ? editArtist?.location : artist.location} readOnly={!isEditing} onChange={e => handleInputChange('location', e.target.value)} />
                </div>
                <div className="artist-profile-form-group">
                  <label className="artist-profile-label">Rating</label>
                  <input className="artist-profile-input" type="text" value={isEditing ? editArtist?.rating : artist.rating} readOnly={!isEditing} onChange={e => handleInputChange('rating', e.target.value)} />
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
              <>
                {/* Upload UI */}
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                  {/* Profile Pic Upload */}
                  <div>
                    <label style={{ fontWeight: 600 }}>Upload Profile Pic</label><br />
                    {/* UTHANA HAI YE */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setUploading(true);
                        setUploadError(null);
                        const formData = new FormData();
                        formData.append('images', file);
                        try {
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
                      }}
                      disabled={uploading}
                      style={{ marginRight: '0.5rem' }}
                    />
                      {artist.imageUrl ? (
                      <div className="artist-profile-form-group">
                        <label className="artist-profile-label">Profile Image</label>
                        <img
                          src={artist.imageUrl ? `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(artist.imageUrl)}` : ''}
                          alt={`${artist.stageName} gallery`}
                          className="artist-profile-img"
                          style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.5rem' }}
                        />
                      </div>
                    ) :(
                      <p>No images uploaded yet.</p>
                    )}  
                  </div>
                  {/* UTHANA HAI YE */}
                  {/* Banner Upload */}
                  <div>
                    <label style={{ fontWeight: 600 }}>Upload Banner Image</label><br />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setUploading(true);
                        setUploadError(null);
                        const formData = new FormData();
                        formData.append('images', file);
                        try {
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
                      }}
                      disabled={uploading}
                    />
                    {artist.coverImage ? (
                  <div className="artist-profile-form-group">
                    <label className="artist-profile-label">Banner Image</label>
                    <img
                      src={artist.coverImage ? `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(artist.coverImage)}` : ''}
                      alt={`${artist.stageName} profile`}
                      className="artist-profile-img"
                      style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', marginBottom: '0.5rem' }}
                    />
                  </div>
                ):(
                  <p>No images uploaded yet.</p>
                )}
                  </div>
                  {uploading && <span style={{ color: '#6c2bd9' }}>Uploading...</span>}
                  {uploadError && <span style={{ color: 'red' }}>{uploadError}</span>}
                  {uploadSuccess && <span style={{ color: 'green' }}>{uploadSuccess}</span>}
                </div>
              </>
            )}
            {selectedMenu === 'Social Media Links' && (
              <>
                <h2>Social Media Links</h2>
                {artist.socialMediaLinks && artist.socialMediaLinks.length > 0 ? (
                  <ul style={{ padding: 0, listStyle: 'none' }}>
                    {artist.socialMediaLinks.map((link, idx) => (
                      <li key={idx} className="artist-profile-form-group">
                        <label className="artist-profile-label">{link.platform}</label>
                        <input className="artist-profile-input" type="text" value={link.url} readOnly />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No social media links available.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

function AutoResizeTextarea({ value, className, ...props }) {
  const textareaRef = React.useRef(null);
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      className={className}
      value={value}
      {...props}
      rows={1}
      style={{ overflow: 'hidden' }}
    />
  );
}

export default ArtistProfilePage;
