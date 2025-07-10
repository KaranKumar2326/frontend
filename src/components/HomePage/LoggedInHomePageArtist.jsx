import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggedInHomePageArtist.css';
import CardList from '../CardList';
import Footer from './Footer';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Search, Headphones, CalendarCheck } from "lucide-react";
import { Link } from "wouter";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import './CallToAction.css';
import { artistImageUrls } from '../data/mockData';
import FeaturedArtists from './FeaturedArtist';
import ImageSlider from './ImageSlider';
import NavigationBar from '../NavigationBar';
import AllArtistsList from './AllArtistsList';

function LoggedInHomePageArtist() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: '', email: '' });
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [artistId, setArtistId] = useState('');

  // Check for artist login on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = (localStorage.getItem('role') || '').toLowerCase();
    if (!isLoggedIn || role !== 'artist') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    navigate('/login');
  };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('artist_id');
        setArtistId(id);
        // Fetch user info
        const userName = localStorage.getItem('name');
        const userEmail = localStorage.getItem('email');
        if (userName && userEmail) {
          setUser({ name: userName, email: userEmail });
        } else {
          navigate('/login');
          return;
        }
        // Fetch all artists for the gallery
        const allArtistsResponse = await fetch('https://backend-musical.onrender.com/api/artists');
        const allArtistsData = await allArtistsResponse.json();
        let allGalleryMedia = [];
        allArtistsData.forEach(artist => {
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
      } catch (error) {
        console.error('Error fetching data:', error);
        setGalleryMedia([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleHireArtistClick = () => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    } else {
      navigate('/jamming');
    }
  };
  const handleCollaboration = () => {
    if (!localStorage.getItem('isLoggedIn')) {
      navigate('/login');
    } else {
      navigate('/all-artists');
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="page-container">
        <div className="background-image">
          </div>
        {/* Hero Section */}
        <div className="hero-container">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              // text color
              style={{ color: 'white' , textAlign: 'left' }}
            >
              Welcome to Musical Meet
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join us in celebrating the joy of music and connecting with artists from around the world.
            </motion.p>
            <div className="hero-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHireArtistClick}
                style={{
                  background: '#6c2bd9',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '40px',
                  padding: '14px 38px',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(108,43,217,0.12)',
                  marginRight: '18px',
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  outline: 'none',
                  minWidth: '210px',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  marginTop: '8px',
                  display: 'inline-block',
                }}
              >
                Host a Jamming Session
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCollaboration}
                style={{
                  background: '#f0e11a',
                  color: '#6c2bd9',
                  border: 'none',
                  borderRadius: '40px',
                  padding: '14px 38px',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(108,43,217,0.10)',
                  marginRight: '0',
                  cursor: 'pointer',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  outline: 'none',
                  minWidth: '210px',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  marginTop: '8px',
                  display: 'inline-block',
                }}
              >
                Collaborate with Artists
              </motion.button>
            </div>
          </div>
        </div>

        {/* Cards Deck Section */}
        <div className="deck-section">
          <h2 className="section-title">What We Offer</h2>
          <div className="cards-scroll-container">
            <div className="cards-wrapper">
              {[
                {
                  title: "Connect",
                  content: "Connect with various artists across our platform, building your network all across the Internet",
                  className: "deck-card-connect"
                },
                {
                  title: "Create",
                  content: "Create joy with your music and share it with the world",
                  className: "deck-card-create"
                },
                {
                  title: "Collaborate",
                  content: "Collaborate with artists in different events or Jamming sessions!",
                  className: "deck-card-collaborate"
                },
                {
                  title: "Perform",
                  content: "Showcase your talent at events and gatherings",
                  className: "deck-card-perform"
                },
                {
                  title: "Grow",
                  content: "Expand your audience and professional network",
                  className: "deck-card-grow"
                }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  className={`deck-card ${card.className}`}
                  onMouseEnter={() => setHoveredCard(index % galleryImages.length)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{ y: -10 }}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="deck-card-title">{card.title}</span>
                  <hr className="deck-card-separator" />
                  <p style={{ color: 'black' }}>{card.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <h2 className="section-title">Find Artists</h2>
          <div className="search-container">
            <p className="search-description">
              Search for artists near you by name, genre, or location to find the perfect match for your event or project.
            </p>
            <div className="search-input-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Find Artist near me..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>





        <FeaturedArtists />

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.03 }}
            >
              <Headphones className="feature-icon" />
              <h3>Curated Artists & Customized Setups</h3>
              <p>Only verified and professional artists with customized setups to meet every occasion requirement.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.03 }}
            >
              <CalendarCheck className="feature-icon" />
              <h3>Secure Payment & Free Cancellation</h3>
              <p>Flexible booking with a 20% deposit and free cancellation up to 3 days before the event.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.03 }}
            >
              <Music className="feature-icon" />
              <h3>Hassle-Free Execution</h3>
              <p>Seamless end-to-end execution with 24/7 support to ensure a memorable experience.</p>
            </motion.div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="gallery-section">
          <h2 className="section-title">Gallery</h2>
          <ImageSlider media={galleryMedia} />
        </div>

        
      </div>
      <Footer />
    </>
  );
}

export default LoggedInHomePageArtist;