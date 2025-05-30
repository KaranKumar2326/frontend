import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import './ArtistProfilePage.css';
import { apiRequest } from '../api/api';
import Footer from './Footer'; // Assuming you have a Footer component

const ArtistProfilePage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0); // State for managing selected tab

  useEffect(() => {
    apiRequest('/api/artists/:id', 'GET', { id })
      .then(data => {
        setArtist(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load artist profile.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!artist) return null;

  return (
    <Box bgcolor="#f9f9f9" minHeight="100vh">
      {/* Banner with artist image */}
      <Box className="artist-profile-banner">
        <img
          src={artist.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
          alt={artist.stageName}
          className="artist-profile-banner-img"
        />
      </Box>
      {/* Profile Info Card - overlaps banner, row layout */}
      <Box display="flex" justifyContent="center" alignItems="flex-start" mt={0}>
        <Box className="artist-profile-info-card">
          {/* Profile Pic */}
          <Box className="artist-profile-pic">
            <img
              src={artist.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
              alt={artist.stageName}
              className="artist-profile-pic-img"
            />
          </Box>
          {/* Name and Data */}
          <Box className="artist-profile-name-data">
            <Typography className="artist-profile-stage-name">{artist.stageName}</Typography>
            <Box className="artist-profile-rating-row">
              <span className="artist-profile-star">★</span>
              <Typography className="artist-profile-rating">{artist.rating}</Typography>
            </Box>
            <Typography className="artist-profile-location">{artist.location}</Typography>
            <Typography className="artist-profile-experience">Experience: {artist.experience || 'N/A'} years</Typography>
            <Typography className="artist-profile-genre">Genre: {artist.genres && artist.genres.length > 0 ? artist.genres.map(g => g.name).join(', ') : 'N/A'}</Typography>
            <Typography className="artist-profile-pricing">
              {artist.pricing && artist.pricingUnit ? (
                `$${artist.pricing}/${artist.pricingUnit}`
              ) : (
                <span className="artist-profile-not-listed">Not listed</span>
              )}
            </Typography>
          </Box>
          {/* Book Now Button */}
          <Box className="artist-profile-book-btn-row">
            <button className="artist-profile-book-btn">
              Book Now
            </button>
          </Box>
        </Box>
      </Box>
      {/* Tab Options Below Profile Card */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Box className="artist-profile-tabs-row">
          {['About', 'Instruments', 'Booking Options'].map((tab, idx) => (
            <Box
              key={tab}
              className={`artist-profile-tab${selectedTab === idx ? ' selected' : ''}`}
              onClick={() => setSelectedTab(idx)}
            >
              <Typography
                className={`artist-profile-tab-label${selectedTab === idx ? '' : ' unselected'}`}
                variant="h6"
              >
                {tab}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Tab Content Card */}
      <Box display="flex" justifyContent="center" mt={2} mb={8}>
        <Box className="artist-profile-tab-content">
          {selectedTab === 0 && (
            // About Tab
            <Typography className="artist-profile-tab-body">
              {artist.description || 'No description available.'}
            </Typography>
          )}
          {selectedTab === 1 && (
            // Instruments Tab
            <Typography className="artist-profile-tab-body">
              {artist.instruments && artist.instruments.length > 0
                ? artist.instruments.map(i => i.name).join(', ')
                : 'No instruments listed.'}
            </Typography>
          )}
          {selectedTab === 2 && (
            // Booking Options Tab
            <Typography className="artist-profile-tab-body">
              {artist.pricing && artist.pricingUnit
                ? `Booking Price: $${artist.pricing} per ${artist.pricingUnit}`
                : 'No booking options listed.'}
              <br />
              {artist.email && (
                <span>Email: {artist.email}</span>
              )}
              <br />
              {artist.phone && (
                <span>Phone: {artist.phone}</span>
              )}
            </Typography>
          )}
        </Box>
      </Box>
      <Footer/>
    </Box>
    
  );
};

export default ArtistProfilePage;
