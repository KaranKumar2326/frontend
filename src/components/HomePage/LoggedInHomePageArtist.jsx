import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggedInHomePageArtist.css';
import CardList from '../CardList';
import Footer from './Footer';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube ,Search , Headphones , CalendarCheck} from "lucide-react";
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
    return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
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
          const artistResponse = await fetch(`http://localhost:3001/api/artists/${id}`);
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
        const allArtistsResponse = await fetch('http://localhost:3001/api/artists');
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
    return <div>Loading...</div>;
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
        <div className="page-container fancy-background" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: '0 auto' , padding:'0px'}}>
          <div className="background-image">
          </div>
            <header className="hero-section" style={{ zIndex: 1, height:'100vh', padding: '20px', boxSizing: 'border-box', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
              <div className='content'>
                <div>
                  <h1 className="hero-title" style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px', fontSize: '3rem' }}>Welcome to Musical Meet</h1>
                </div>
                <div>
                  <p className="hero-subtitle" style={{ color: 'white', fontWeight: 'bold', marginBottom: '30px', fontSize: '1.5rem' }}>
                  Join us in celebrating the joy of music and connecting with artists from around the world.
                  </p>
                </div>
                <div className="button-container" style={{ display: 'flex', gap: '10px', justifyContent: 'left' }}>
                  <button 
                    className="P" 
                    style={{fontWeight:'bold', padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#6c2bd9', color: 'white', border: '3px',borderColor:'#f0e11a', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    onClick={handleHireArtistClick}
                  >
                    Host a Jamming Session
                  </button>
                  <button className="Y" style={{fontWeight:'bold', padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#f0e11a',color: '#6c2bd9', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    onClick={handleHireArtistClick}
                  >
                    Collaborate with Artists 
                  </button>
                </div>
              </div>
            </header>
        </div>

        <div className="deck" style={{ position: 'relative' }}>
          {/* Show hovered image as background */}
          {hoveredCard !== null && galleryImages[hoveredCard] && (
            <img
              src={galleryImages[hoveredCard]}
              alt="Deck Hover Visual"
              className={`deck-bg-image${hoveredCard !== null ? ' deck-bg-image--visible' : ''}`}
            />
          )}
          <div className="deck-container" style={{ position: 'relative', zIndex: 1 }}>
            <div
              className="deck-card deck-card-connect"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span className="deck-card-title">Connect</span>
              <hr className="deck-card-separator" />
              <h3>Connect with various artists across our platform , building your network , all across the Internet</h3>
            </div>
            <div
              className="deck-card deck-card-create"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span className="deck-card-title">Create</span>
              <hr className="deck-card-separator" />
              <h3>Create what i need to know ? </h3>
            </div>
            <div
              className="deck-card deck-card-collaborate"
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span className="deck-card-title">Collaborate</span>
              <hr className="deck-card-separator" />
              <h3>Collaborate with artists in different events or Jamming sessions !</h3>
            </div>
          </div>
        </div>
        <div className="search-bar-container">
          <h2 className="search-heading">Find Artists</h2>
          <div className="search-bar-details">
            <p>Search for artists near you by name, genre, or location to find the perfect match for your event or project.</p>
            <input
              type="text"
              placeholder="Find Artist near me..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-bar"
            />
          </div>
        </div>
        <FeaturedArtists />

        <div className="features-section">
          <h2>Why Choose Us?</h2>
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
          <h2 className="slider-heading">Gallery</h2>
          <ImageSlider images={galleryImages} />
        </div>

        <Footer />
      </div>
    </>
  );
}
export default LoggedInHomePageArtist;
