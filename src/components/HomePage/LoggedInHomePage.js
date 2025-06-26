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
  const [galleryImages, setGalleryImages] = useState([]);

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
    // Fetch all artists and collect all images
    fetch('https://backend-musical.onrender.com/api/artists')
      .then(res => res.json())
      .then(data => {
        let allImages = [];
        data.forEach(artist => {
          if (Array.isArray(artist.gallery)) {
            allImages = allImages.concat(artist.gallery.map(getImageSrc));
          }
          if (artist.imageUrl) allImages.push(getImageSrc(artist.imageUrl));
          if (artist.coverImage) allImages.push(getImageSrc(artist.coverImage));
        });
        allImages = Array.from(new Set(allImages.filter(Boolean)));
        setGalleryImages(allImages);
      })
      .catch(() => setGalleryImages([]));
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
        <div className="background-image"></div>
        
        {/* Hero Section */}
        <div className="hero-container">
          <div className="hero-content">
            <div>
              <h1 className="hero-title">Welcome to Musical Meet</h1>
            </div>
            <div className="user-info">
              <p>Welcome, {user.name}!</p>
              <p>Your email: {user.email}</p>
            </div>
            <div>
              <p className="hero-subtitle">
                Join us in celebrating the joy of music and connecting with artists from around the world.
              </p>
            </div>

            <div className="hero-buttons">
              <button 
                className="btn-primary" 
                onClick={handleHireArtistClick}
              >
                Hire an Artist
              </button>
              <button 
                className="btn-secondary" 
                onClick={handleJammingSessionClick}
              >
                Jamming sessions near you 
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
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
                  <button className="cta-button primary-btn" onClick={handleJammingSessionClick}>
                    Jamming Sessions Near You
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search Section */}
        <div className="search-section">
          <h2 className="section-title">Find Artists</h2>
          <div className="search-container">
            <p className="search-description">
              Search for your favorite artists, or checkout our featured artists. Choose what suits best for your occasion!
            </p>
            <input
              type="text"
              placeholder="Find Artist near me..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          <FeaturedArtist />
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Curated Artists & Customized Setups</h3>
              <p>Only verified and professional artists with customized setups to meet every occasion requirement.</p>
            </div>
            <div className="feature-card">
              <h3>Secure Payment & Free Cancellation</h3>
              <p>Flexible booking with a 20% deposit and free cancellation up to 3 days before the event.</p>
            </div>
            <div className="feature-card">
              <h3>Hassle-Free Execution</h3>
              <p>Seamless end-to-end execution with 24/7 support to ensure a memorable experience.</p>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="gallery-section">
          <h2 className="section-title">Gallery</h2>
          <ImageSlider images={galleryImages} />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LoggedInHomePage;
