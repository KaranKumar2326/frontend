import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert
} from "@mui/material";
import { Star, StarHalf } from "lucide-react";
import "./PublicArtistPage.css";
import NavigationBar from "../NavigationBar";
import Footer from "./Footer";
import OtherArtists from "./OtherArtists";

export default function PublicArtistProfilePage() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/artists/${_id}`);
        const result = await response.json();
        if (response.ok && result) {
          setArtist(result);
        } else {
          setError(result.message || "Artist not found");
        }
      } catch (err) {
        setError("Artist not found");
      }
      setLoading(false);
    };
    fetchArtist();
  }, [_id]);

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="artist-profile-star" size={18} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="artist-profile-star" size={18} />);
    }
    return stars;
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
    return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!artist) return <Alert severity="error">Artist not found</Alert>;
  console.log("Artist coverImage:", artist.coverImage);
  console.log("Final image src:", getImageSrc(artist.coverImage));

  return (
    <>
      <NavigationBar
        hideProfile={false}
        userProfilePic={artist ? getImageSrc(artist.imageUrl) : undefined}
      />
      <Box bgcolor="#f9f9f9" minHeight="100vh" className="artist-profile-bg">
        {/* Banner Image */}
        <Box className="artist-profile-banner" >
          <img
            src={getImageSrc(artist.coverImage) || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
            alt={artist.stageName}
            className="artist-profile-banner-img"
            onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"; }}
          />
        </Box>
        {/* Profile Info Card */}
        <Box display="flex" justifyContent="center" alignItems="flex-start" mt={0}>
          <Box className="artist-profile-info-card public-profile-info-card" style={{ position: 'relative', width: '50vw', minWidth: 320 }}>
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {/* Profile Pic - left */}
              <Box className="artist-profile-pic public-profile-pic-top-centered" style={{ marginRight: 32, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={getImageSrc(artist.imageUrl) || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                  alt={artist.imageUrl}
                  className="artist-profile-pic-img public-profile-pic-img-bordered"
                  onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"; }}
                />
              </Box>
              {/* Name and Info - center */}
              <Box className="public-profile-info-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box className="artist-profile-name-data" style={{ textAlign: 'center' }}>
                  <div className="artist-profile-stage-name">{artist.stageName}</div>
                  <Box className="artist-profile-rating-row">
                    {renderStars(Number(artist.rating))}
                    <span className="artist-profile-rating">{artist.rating}</span>
                  </Box>
                  <div className="artist-profile-location">{artist.location || "Unknown"}</div>
                  <div className="artist-profile-experience">Experience: {artist.experience || 'N/A'} years</div>
                  <div className="artist-profile-genre">
                    Genre: {artist.genres?.map(g => g.name).join(', ') || 'N/A'}
                  </div>
                  <div className="artist-profile-pricing">
                    {artist.pricing && artist.pricingUnit ? (
                      `$${artist.pricing}/${artist.pricingUnit}`
                    ) : (
                      <span className="artist-profile-not-listed">Not listed</span>
                    )}
                  </div>
                </Box>
              </Box>
              {/* Edit Profile Button - right */}
              <Box style={{ marginLeft: 32, display: 'flex', alignItems: 'center' }}>
                <button className="artist-profile-book-btn" onClick={() => navigate(`/ArtistProfilePage/${_id}`)}>
                  Edit Profile
                </button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Other Artists Section
        {/* Other Artists - right side */}
        {/* <Box style={{ marginLeft: 32, minWidth: 200 }}>
          <OtherArtists currentArtistId={artist._id || artist.id} />
        </Box>  */}

        {/* Tabs */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Box className="artist-profile-tabs-row">
            {['About', 'Instruments', 'Booking Options'].map((tab, idx) => (
              <Box
                key={tab}
                className={`artist-profile-tab${selectedTab === idx ? ' selected' : ''}`}
                onClick={() => setSelectedTab(idx)}
              >
                <span
                  className={`artist-profile-tab-label${selectedTab === idx ? '' : ' unselected'}`}
                >
                  {tab}
                </span>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Tab Content */}
        <Box display="flex" justifyContent="center" mt={2} mb={8}>
          <Box className="artist-profile-tab-content">
            {selectedTab === 0 && (
              <div className="artist-profile-tab-body">
                {artist.description || 'No description available.'}
              </div>
            )}
            {selectedTab === 1 && (
              <div className="artist-profile-tab-body">
                {artist.instruments?.map(i => i.name).join(', ') || 'No instruments listed.'}
              </div>
            )}
            {selectedTab === 2 && (
              <div className="artist-profile-tab-body">
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
              </div>
            )}
          </Box>
        </Box>

        
      </Box>
      <Footer />
    </>
  );
}
