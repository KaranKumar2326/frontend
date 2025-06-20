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
          setLoading(false);
        } else {
          navigate('/login');
          return;
        }

        // Fetch artist details if ID exists
        if (id) {
          const artistResponse = await fetch(`https://backend-musical.onrender.com/api/artists/${id}`);
          const artistData = await artistResponse.json();
          
          if (Array.isArray(artistData.gallery) && artistData.gallery.length > 0) {
            setGalleryImages(artistData.gallery.map(getImageSrc));
          } else {
            const imgs = [];
            if (artistData.imageUrl) imgs.push(getImageSrc(artistData.imageUrl));
            if (artistData.coverImage) imgs.push(getImageSrc(artistData.coverImage));
            setGalleryImages(imgs);
          }
        }

        // Fetch all artists for the gallery
        const allArtistsResponse = await fetch('https://backend-musical.onrender.com/api/artists');
        const allArtistsData = await allArtistsResponse.json();
        
        let allImages = [];
        allArtistsData.forEach(artist => {
          if (Array.isArray(artist.gallery)) {
            allImages = allImages.concat(artist.gallery.map(getImageSrc));
          }
          if (artist.imageUrl) allImages.push(getImageSrc(artist.imageUrl));
          if (artist.coverImage) allImages.push(getImageSrc(artist.coverImage));
        });
        
        // Remove duplicates and falsy values
        allImages = Array.from(new Set(allImages.filter(Boolean)));
        setGalleryImages(prev => [...new Set([...prev, ...allImages])]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setGalleryImages([]);
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
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHireArtistClick}
              >
                Host a Jamming Session
              </motion.button>
              <motion.button
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHireArtistClick}
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
                  content: "Create what i need to know ?",
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
                  <p>{card.content}</p>
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
          <ImageSlider images={galleryImages} />
        </div>

        
      </div>
      <Footer />
    </>
  );
}

export default LoggedInHomePageArtist;