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
import myImage from "../../public/defaultpic.png";
import myBg from "../../public/defaultbg.png";
import insta from "../../public/insta.jpeg";
import spotify from "../../public/spotify.png";
import apple from "../../public/apple.jpeg";
import SoundCloud from "../../public/soundcloud.jpeg";
import youtube from "../../public/youtube.png";
import ImageSlider from './ImageSlider';


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
        const response = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}`);
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
    return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };

  // Prepare gallery media (images and videos) for the slider
  const galleryImages = Array.isArray(artist?.galleryImages)
    ? artist.galleryImages.filter(img => !!img).map(img => ({ type: 'image', src: getImageSrc(img) }))
    : [];
  // Videos are stored in artist.videos as Google Drive links
  const getVideoSrc = (url) => {
    if (!url) return null;
    let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
    if (!match) {
      match = url.match(/[?&]id=([\w-]+)/);
    }
    let directUrl = url;
    if (match && match[1]) {
      // For video, use Google Drive's direct video link
      directUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    // Proxy through backend for CORS if needed
    return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };
  const galleryVideos = Array.isArray(artist?.videos)
    ? artist.videos.filter(v => !!v).map(videoUrl => ({ type: 'video', src: getVideoSrc(videoUrl) }))
    : [];
  const galleryMedia = [...galleryImages, ...galleryVideos];

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
            src={getImageSrc(artist.coverImage) || myBg}
            alt={artist.stageName}
            className="artist-profile-banner-img"
            onError={e => { e.target.onerror = null; e.target.src = myBg; }}
          />
        </Box>
        {/* Profile Info Card */}
        <Box display="flex" justifyContent="center" alignItems="flex-start" mt={0}>
          <Box className="artist-profile-info-card public-profile-info-card" style={{ position: 'relative', width: '50vw', minWidth: 320 }}>
            <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {/* Profile Pic - left */}
              <Box className="artist-profile-pic public-profile-pic-top-centered" style={{ marginRight: 32, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  src={getImageSrc(artist.imageUrl) || myImage}
                  alt={artist.imageUrl}
                  className="artist-profile-pic-img public-profile-pic-img-bordered"
                  onError={e => { e.target.onerror = null; e.target.src = myImage; }}
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
                  <div className="artist-profile-location">{artist.preferredLocation || "Unknown"}</div>
                  <div className="artist-profile-experience">Experience: {artist.exp || 'N/A'} years</div>
                  <div className="artist-profile-genre">
                    Genre: {Array.isArray(artist.genres)
                      ? artist.genres.map(g => (g && g.name ? g.name : '')).filter(Boolean).join(', ') || 'N/A'
                      : 'N/A'}
                  </div>
                  <div className="artist-profile-pricing">
                    {artist.pricing && artist.pricingUnit ? (
                      `₹${artist.pricing}/${artist.pricingUnit}`
                    ) : (
                      <span className="artist-profile-not-listed">Not listed</span>
                    )}
                  </div>
                </Box>
              </Box>
              {/* Edit Profile Button - right */}
              <Box style={{ marginLeft: 32, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <button className="artist-profile-book-btn" onClick={() => navigate(`/ArtistProfilePage/${_id}`)}>
                  Edit Profile
                </button>
                {/* Social Media Links */}
                {artist.socialMediaLinks && artist.socialMediaLinks.length > 0 && (
                  <Box mt={2} style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Social Links</div>
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 20, justifyContent: 'center' }}>
                      {artist.socialMediaLinks.map((link, idx) => {
                        // Map platform to icon URL (SVGs or PNGs in public folder)
                        const platformIcons = {
                          Instagram: insta,
                          Spotify: spotify,
                          'Apple Music': apple,
                          SoundCloud: SoundCloud,
                          YouTube: youtube,
                        };
                        const iconSrc = platformIcons[link.platform] || '/icons/link.svg';
                        return (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 54,
                              height: 54,
                              borderRadius: '50%',
                              background: '#fff',
                              boxShadow: '0 2px 8px #e0e0e0',
                              padding: 6,
                              border: '2px solid #eee',
                              transition: 'box-shadow 0.2s, border 0.2s',
                              margin: 0
                            }}
                            title={link.platform}
                          >
                            <img src={iconSrc} alt={link.platform} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: '50%' }} />
                          </a>
                        );
                      })}
                    </div>
                  </Box>
                )}
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
                {Array.isArray(artist.instruments)
                  ? artist.instruments.map(i => (i && i.name ? i.name : '')).filter(Boolean).join(', ') || 'No instruments listed.'
                  : 'No instruments listed.'}
              </div>
            )}
            {selectedTab === 2 && (
              <div className="artist-profile-tab-body">
                {artist.pricing && artist.pricingUnit
                  ? `Booking Price: ₹${artist.pricing} per ${artist.pricingUnit}`
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

        {/* Image Slider Section */}
        <div className="image-slider-section">
          <h2 className="slider-heading" style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '2.8rem', textAlign: 'center', letterSpacing: '1px' }}>Gallery</h2>
          <ImageSlider media={galleryMedia} />
        </div>
        
      </Box>
      <Footer />
    </>
  );
}

