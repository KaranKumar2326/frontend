import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggedInHomePage.css';
import './Footer.css';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Search, Headphones, CalendarCheck } from "lucide-react";
import { Link } from "wouter";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import './CallToAction.css';
import myImage from '../../public/logo.jpeg';
import FeaturedArtist from './FeaturedArtist';
import ImageSlider from './ImageSlider';
import NavigationBar from '../NavigationBar';
import Footer from './Footer'; // Import the new Footer component
import { toast } from 'react-toastify';  // Import toast function
import 'react-toastify/dist/ReactToastify.css';  // Import styles for toast notifications


const LoggedInHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [galleryMedia, setGalleryMedia] = useState([]);

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

  // Retrieve user info from localStorage when the component mounts
  useEffect(() => {
    const userName = localStorage.getItem('name');
    const userEmail = localStorage.getItem('email');
    console.log('User Name:', userName);
    console.log('User Email:', userEmail);
    if (userName && userEmail) {
      setUser({ name: userName, email: userEmail });
    } else {
      navigate('/login');  // Redirect to login if user info is not found
    }

    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (!isLoggedIn || (role && role.toLowerCase() !== 'user')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch all artists and collect all non-null images and videos from galleryImages and videos
    fetch('https://backend-musical.onrender.com/api/artists')
      .then(res => res.json())
      .then(data => {
        let allGalleryMedia = [];
        data.forEach(artist => {
          // Images
          if (Array.isArray(artist.galleryImages)) {
            const validImages = artist.galleryImages.filter(img => !!img);
            allGalleryMedia = allGalleryMedia.concat(validImages.map(img => ({ type: 'image', src: getImageSrc(img) })));
          }
          // Videos (Google Drive links)
          if (Array.isArray(artist.videos)) {
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
              return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
            };
            const validVideos = artist.videos.filter(v => !!v);
            allGalleryMedia = allGalleryMedia.concat(validVideos.map(videoUrl => ({ type: 'video', src: getVideoSrc(videoUrl) })));
          }
        });
        // Shuffle the array to get random media
        for (let i = allGalleryMedia.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allGalleryMedia[i], allGalleryMedia[j]] = [allGalleryMedia[j], allGalleryMedia[i]];
        }
        setGalleryMedia(allGalleryMedia);
      })
      .catch(() => setGalleryMedia([]));
  }, []);

  if (loading) {
    return <div>Loading...</div>;  // Show loading state while the user info is being fetched
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('token'); // If you are storing the token too
    toast.success('Logged out successfully');
    console.log('User logged out');
    navigate('/login');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleHireArtistClick = () => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    } else {
      navigate('/all-artists');
    }
  };

  const handleJammingSessionClick = () => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    } else {
      navigate('/jamming');
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="page-container">
       <div className="page-container fancy-background" style={{ display: 'flex', flexDirection: 'column', alignItems: 'cen', justifyContent: 'center', height: '100vh', margin: '0 auto', padding: '0px', position: 'relative', overflow: 'hidden' }}>
  {/* Video Background */}
  <video 
    autoPlay 
    loop 
    muted 
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
      top: 0,
      left: 0
    }}
  >
    <source src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/EeN01lAOxijss6byx/drummer-playing-of-drums-during-a-concert-on-special-event_ragk29dq__d__9009c331ec6ed07cef8c950639de7d51__P360.mp4" />
    Your browser does not support the video tag.
  </video>
  
  {/* Dark overlay for better text visibility */}
  <div style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 0
  }}></div>

  <header className="hero-section" style={{ zIndex: 1, height: '100vh', padding: '20px', boxSizing: 'border-box', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
    <div className='content'>
      <div>
        <h1 className="hero-title" style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px', fontSize: '3rem' }}>Welcome to Musical Meet</h1>
      </div>
      
      <div>
        <p className="hero-subtitle" style={{ color: 'white', fontWeight: 'bold', marginBottom: '30px', fontSize: '1.5rem' }}>
          Join us in celebrating the joy of music and connecting with artists from around the world.
        </p>
      </div>

      <div 
  className="button-container" 
  style={{ 
    display: 'flex', 
    gap: '10px', 
    justifyContent: 'left',
    flexWrap: 'wrap' // Allows buttons to wrap on small screens
  }}
>
  <button
    className="P"
    style={{
      fontWeight: 'bold',
      padding: 'clamp(12px, 2vw, 20px) clamp(20px, 4vw, 40px)', // Responsive padding
      fontSize: 'clamp(0.9rem, 2vw, 1rem)', // Responsive font size
      borderRadius: '40px',
      backgroundColor: '#6c2bd9',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      minWidth: 'min(160px, 100%)', // Adapts to container width on small screens
      letterSpacing: '0.5px',
      marginBottom: '8px',
      marginTop: '8px',
      display: 'inline-block',
      whiteSpace: 'nowrap', // Prevents text from wrapping
      transition: 'transform 0.2s, box-shadow 0.2s', // Add hover effect
    }}
    onClick={handleHireArtistClick}
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    Hire an Artist
  </button>
  <button
    className="Y"
    style={{
      fontWeight: 'bold',
      padding: 'clamp(12px, 2vw, 20px) clamp(20px, 4vw, 40px)', // Responsive padding
      fontSize: 'clamp(0.9rem, 2vw, 1rem)', // Responsive font size
      borderRadius: '40px',
      backgroundColor: '#f0e11a',
      color: '#6c2bd9',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      minWidth: 'min(160px, 100%)', // Adapts to container width on small screens
      letterSpacing: '0.5px',
      marginBottom: '8px',
      marginTop: '8px',
      display: 'inline-block',
      whiteSpace: 'nowrap', // Prevents text from wrapping
      transition: 'transform 0.2s, box-shadow 0.2s', // Add hover effect
    }}
    onClick={handleJammingSessionClick}
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    Jamming sessions near you
  </button>
</div>
    </div>
  </header>
</div>

        <section className="call-to-action-section">
          <div className="call-to-action-bg">
            <div className="hero-gradient"></div>
          </div>

          <div className="call-to-action-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-container"
            >
              <h2 className="cta-heading">Let's Get Jamming!</h2>
              <p className="cta-subheading">
                Meet people who share your taste and passion for music, have fun jamming sessions, and create unforgettable experiences together!
              </p>
              <div className="cta-buttons">
                <Link href="#">
                  <button
                    className="cta-button primary-btn"
                    style={{
                      fontWeight: 'bold',
                      padding: '20px 20px',
                      fontSize: '1rem',
                      borderRadius: '40px', // fully rounded
                      backgroundColor: '#6c2bd9',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      minWidth: '190px',
                      letterSpacing: '0.5px',
                      marginBottom: '8px',
                      marginTop: '8px',
                      display: 'inline-block',
                    }}
                    onClick={handleJammingSessionClick}
                  >
                    Jamming Sessions Near You
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="search-bar-container">
          <h2 className="search-heading">Find Artists</h2>
          <div className="search-bar-details">
            <p>Search for your favorite artists, or checkout our featured artists. Choose what suits best for your occasion!</p>
            <input
              type="text"
              placeholder="Find Artist near me..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </div>
          <FeaturedArtist />
        </div>

        <div className="features-section">
          <h2 className='whychooseus'>Why Choose Us?</h2>
          <div className="features">
            <div className="feature">
              <h3>Curated Artists & Customized Setups</h3>
              <p>Only verified and professional artists with customized setups to meet every occasion requirement.</p>
            </div>
            <div className="feature">
              <h3>Secure Payment & Free Cancellation</h3>
              <p>Flexible booking with a 20% deposit and free cancellation up to 3 days before the event.</p>
            </div>
            <div className="feature">
              <h3>Hassle-Free Execution</h3>
              <p>Seamless end-to-end execution with 24/7 support to ensure a memorable experience.</p>
            </div>
          </div>
        </div>

        {/* Image Slider Section */}
        <div className="image-slider-section">
          <h2 className="slider-heading" style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '2.8rem', textAlign: 'center', letterSpacing: '1px' }}>Gallery</h2>
          <ImageSlider media={galleryMedia} />
        </div>

        
      </div>
      <Footer />
    </>
  );
};

export default LoggedInHomePage;