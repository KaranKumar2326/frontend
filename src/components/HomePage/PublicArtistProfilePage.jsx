import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button
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
        <Box 
          sx={{ 
            position: 'relative',
            width: '100%',
            height: { xs: '200px', sm: '300px', md: '400px' },
            overflow: 'hidden'
          }}
        >
          <img
            src={getImageSrc(artist.coverImage) || myBg}
            crossOrigin="anonymous"
            alt={artist.stageName}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              display: 'block'
            }}
            onError={e => { e.target.onerror = null; e.target.src = myBg; }}
          />
        </Box>

        {/* Profile Section */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 } }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            
            {/* Mobile Layout (xs - sm) */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {/* Profile Picture */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '4px solid white',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                >
                  <img
                    src={getImageSrc(artist.imageUrl) || myImage}
                    crossOrigin="anonymous"
                    alt={artist.stageName}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover'
                    }}
                    onError={e => { e.target.onerror = null; e.target.src = myImage; }}
                  />
                </Box>
              </Box>

              {/* Artist Info */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: '1.8rem', sm: '2.2rem' } }}>
                  {artist.stageName}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
                  {renderStars(Number(artist.rating))}
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {artist.rating}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                  📍 {artist.preferredLocation || "Unknown"}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                  Experience: {artist.exp || 'N/A'} years
                </Typography>

                <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                  Genre: {Array.isArray(artist.genres)
                    ? artist.genres.map(g => (g && g.name ? g.name : '')).filter(Boolean).join(', ') || 'N/A'
                    : 'N/A'}
                </Typography>

                <Box sx={{ 
                  bgcolor: '#8B00FF', 
                  color: 'white', 
                  px: 3, 
                  py: 1.5, 
                  borderRadius: 2, 
                  display: 'inline-block',
                  mb: 3
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 400 }}>
                    {artist.pricing && artist.pricingUnit ? (
                      `₹${artist.pricing}/${artist.pricingUnit}`
                    ) : (
                      'Price not listed'
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Edit Profile Button */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#8B00FF', // violet
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1rem', // or '1.1rem' for desktop
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(139,0,255,0.3)', // update shadow color to match violet
                    '&:hover': {
                      bgcolor: '#5e0099' // darker violet on hover
                    }
                  }}
                  onClick={() => navigate(`/ArtistProfilePage/${_id}`)}
                >
                  Edit Profile
                </Button>
              </Box>

              {/* Social Media Links */}
              {artist.socialMediaLinks && artist.socialMediaLinks.length > 0 && (
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Connect with me
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    {artist.socialMediaLinks.map((link, idx) => {
                      const platformIcons = {
                        Instagram: insta,
                        Spotify: spotify,
                        'Apple Music': apple,
                        SoundCloud: SoundCloud,
                        YouTube: youtube,
                      };
                      const iconSrc = platformIcons[link.platform] || '/icons/link.svg';
                      return (
                        <Box
                          key={idx}
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 50,
                            height: 50,
                            bgcolor: 'white',
                            borderRadius: '50%',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            border: '2px solid #f0f0f0',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                            }
                          }}
                        >
                          <img 
                            src={iconSrc}
                            crossOrigin="anonymous"
                            alt={link.platform}
                            style={{ width: 28, height: 28, objectFit: 'contain' }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>

            {/* Desktop Layout (md+) */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 6, mb: 4 }}>
              {/* Profile Picture */}
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid white',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  flexShrink: 0
                }}
              >
                <img
                  src={getImageSrc(artist.imageUrl) || myImage}
                  crossOrigin="anonymous"
                  alt={artist.stageName}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover'
                  }}
                  onError={e => { e.target.onerror = null; e.target.src = myImage; }}
                />
              </Box>

              {/* Artist Info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  {artist.stageName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {renderStars(Number(artist.rating))}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {artist.rating}
                  </Typography>
                </Box>

                <Typography variant="h6" sx={{ mb: 1, color: '#666' }}>
                  📍 {artist.preferredLocation || "Unknown"}
                </Typography>

                <Typography variant="body1" sx={{ mb: 1, color: '#666' }}>
                  Experience: {artist.exp || 'N/A'} years
                </Typography>

                <Typography variant="body1" sx={{ mb: 2, color: '#666' }}>
                  Genre: {Array.isArray(artist.genres)
                    ? artist.genres.map(g => (g && g.name ? g.name : '')).filter(Boolean).join(', ') || 'N/A'
                    : 'N/A'}
                </Typography>

                <Box sx={{ 
                  bgcolor: '#8B00FF', 
                  color: 'white', 
                  px: 3, 
                  py: 1.5, 
                  borderRadius: 2, 
                  display: 'inline-block'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {artist.pricing && artist.pricingUnit ? (
                      `₹${artist.pricing}/${artist.pricingUnit}`
                    ) : (
                      'Price not listed'
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Right Side - Button & Social */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: '#8B00FF',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(0,123,255,0.3)',
                    '&:hover': {
                      bgcolor: '#5e0099'
                    }
                  }}
                  onClick={() => navigate(`/ArtistProfilePage/${_id}`)}
                >
                  Edit Profile
                </Button>

                {/* Social Media Links */}
                {artist.socialMediaLinks && artist.socialMediaLinks.length > 0 && (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                      Connect
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      {artist.socialMediaLinks.map((link, idx) => {
                        const platformIcons = {
                          Instagram: insta,
                          Spotify: spotify,
                          'Apple Music': apple,
                          SoundCloud: SoundCloud,
                          YouTube: youtube,
                        };
                        const iconSrc = platformIcons[link.platform] || '/icons/link.svg';
                        return (
                          <Box
                            key={idx}
                            component="a"
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 50,
                              height: 50,
                              bgcolor: 'white',
                              borderRadius: '50%',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              border: '2px solid #f0f0f0',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                              }
                            }}
                          >
                            <img 
                              src={iconSrc}
                              crossOrigin="anonymous"
                              alt={link.platform}
                              style={{ width: 28, height: 28, objectFit: 'contain' }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Tabs Section */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 2 }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              mb: 3
            }}>
              <Box sx={{ 
                display: 'flex',
                bgcolor: 'white',
                borderRadius: 3,
                p: 0.5,
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                width: { xs: '100%', sm: 'auto' }
              }}>
                {['About', 'Instruments', 'Booking Options'].map((tab, idx) => (
                  <Box
                    key={tab}
                    onClick={() => setSelectedTab(idx)}
                    sx={{
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      cursor: 'pointer',
                      borderRadius: 2.5,
                      flex: { xs: 1, sm: 'none' },
                      textAlign: 'center',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      fontWeight: 600,
                      color: selectedTab === idx ? 'white' : '#666',
                      bgcolor: selectedTab === idx ? '#8B00FF' : 'transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: selectedTab === idx ? '#8B00FF' : '#f8f9fa'
                      }
                    }}
                  >
                    {tab}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Tab Content */}
            <Box sx={{ 
              bgcolor: 'white',
              borderRadius: 3,
              p: { xs: 3, sm: 4 },
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              minHeight: '200px'
            }}>
              {selectedTab === 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    About Me
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#666' }}>
                    {artist.description || 'No description available.'}
                  </Typography>
                </Box>
              )}
              
              {selectedTab === 1 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
                    My Instruments
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#666' }}>
                    {Array.isArray(artist.instruments)
                      ? artist.instruments.map(i => (i && i.name ? i.name : '')).filter(Boolean).join(', ') || 'No instruments listed.'
                      : 'No instruments listed.'}
                  </Typography>
                </Box>
              )}
              
              {selectedTab === 2 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#333' }}>
                    Booking Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ 
                      bgcolor: '#f8f9fa', 
                      p: 3, 
                      borderRadius: 2,
                      border: '1px solid #e9ecef'
                    }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        Pricing:
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        {artist.pricing && artist.pricingUnit
                          ? `₹${artist.pricing} per ${artist.pricingUnit}`
                          : 'No booking options listed.'}
                      </Typography>
                    </Box>
                    
                    {(artist.email || artist.phone) && (
                      <Box sx={{ 
                        bgcolor: '#f8f9fa', 
                        p: 3, 
                        borderRadius: 2,
                        border: '1px solid #e9ecef'
                      }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                          Contact Information:
                        </Typography>
                        {artist.email && (
                          <Typography variant="body1" sx={{ color: '#666', mb: 1 }}>
                            📧 {artist.email}
                          </Typography>
                        )}
                        {artist.phone && (
                          <Typography variant="body1" sx={{ color: '#666' }}>
                            📞 {artist.phone}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Gallery Section */}
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
          <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Typography 
              variant="h4" 
              sx={{ 
                textAlign: 'center', 
                mb: 4, 
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
              }}
            >
              Gallery
            </Typography>
            <ImageSlider media={galleryMedia} />
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}

