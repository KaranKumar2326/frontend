import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import { Star, StarHalf } from "lucide-react";
import "./css/PublicArtistPage.css";
import NavigationBar from "../NavigationBar";
import Footer from "./Footer";
import OtherArtists from "./OtherArtists";

export default function PublicArtistPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/artists/${id}`);
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
  }, [id]);

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

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!artist) return <Alert severity="error">Artist not found</Alert>;

  return (
    <>
      <NavigationBar />
      <Box className="public-artist-bg">
        {/* Banner Image */}
        <Box className="public-artist-banner">
          <img
            src={artist.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
            alt={artist.stageName}
            className="public-artist-banner-img"
          />
        </Box>

        {/* Main Content Row: Profile Info Card + Other Artists */}
        <Box className="public-artist-main-row">
          <Box className="public-artist-info-card" style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            {/* Profile Pic + Rating (left) */}
            <Box className="public-artist-pic" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 200 }}>
              <img
                src={artist.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"}
                alt={artist.stageName}
                className="public-artist-pic-img"
              />
              <div className="public-artist-rating-row" style={{ marginTop: '1rem' }}>
                {renderStars(Number(artist.rating))}
                <span className="public-artist-rating">{artist.rating}</span>
              </div>
            </Box>
            {/* Name (center, shifted right/up) and Price below */}
            <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', position: 'relative', left: 260, top: -10 }}>
              <div className="public-artist-name">{artist.stageName}</div>
              <div style={{ fontFamily: 'Montserrat, Inter, Arial, sans-serif', fontWeight: 600, color: '#6c2bd9', fontSize: '1.1rem', marginTop: 4 }}>
                {artist.pricing && artist.pricingUnit ? (
                  `$${artist.pricing} / ${artist.pricingUnit}`
                ) : (
                  <span style={{ color: '#888', fontStyle: 'italic' }}>Not listed</span>
                )}
              </div>
            </Box>
            {/* Book Now button (right, absolute) */}
            <button className="public-artist-book-btn" style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 2 }}>
              Book Now
            </button>
          </Box>
          <Box className="public-artist-other-artists">
            <OtherArtists currentArtistId={artist._id || artist.id} />
          </Box>
        </Box>

        {/* Tabs */}
        <Box className="public-artist-tabs-row">
          {['About', 'Instruments', 'Booking Options'].map((tab, idx) => (
            <Box
              key={tab}
              className={`public-artist-tab${selectedTab === idx ? ' selected' : ''}`}
              onClick={() => setSelectedTab(idx)}
            >
              <span className={`public-artist-tab-label${selectedTab === idx ? '' : ' unselected'}`}>{tab}</span>
            </Box>
          ))}
        </Box>

        {/* Tab Content */}
        <Box className="public-artist-tab-content">
          {selectedTab === 0 && (
            <div className="public-artist-tab-body">{artist.description || 'No description available.'}</div>
          )}
          {selectedTab === 1 && (
            <div className="public-artist-tab-body">{artist.instruments?.map(i => i.name).join(', ') || 'No instruments listed.'}</div>
          )}
          {selectedTab === 2 && (
            <div className="public-artist-tab-body">
              {artist.pricing && artist.pricingUnit
                ? `Booking Price: $${artist.pricing} per ${artist.pricingUnit}`
                : 'No booking options listed.'}
              <br />
              {artist.email && <span>Email: {artist.email}</span>}
              <br />
              {artist.phone && <span>Phone: {artist.phone}</span>}
            </div>
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
}
