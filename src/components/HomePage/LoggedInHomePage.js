import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoggedInHomePage.css';
import { artistImageUrls } from '../data/mockData';
import './Footer.css';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube ,Search , Headphones , CalendarCheck} from "lucide-react";
import { Link } from "wouter";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import './CallToAction.css';
import myImage from '../../public/logo.jpeg';
import FeaturedArtist from './FeaturedArtist';
import ImageSlider from './ImageSlider';
import NavigationBar from '../NavigationBar';
import Footer from './Footer'; // Import the new Footer component

const LoggedInHomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleHireArtistClick = () => {
    navigate('/login');
  };

  const[openProfile, setOpenProfile] = useState(false);

  return (
    <>
      <NavigationBar />
      <div className="page-container">
        <div className="page-container fancy-background" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: '0 auto' , padding:'0px'}}>
        {/* <div className='hero-container' style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}> */}
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
                    Hire an Artist
                  </button>
                  <button className="Y" style={{fontWeight:'bold', padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#f0e11a',color: '#6c2bd9', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    Jamming sessions near you 
                  </button>
                </div>
              </div>
            </header>
        {/* </div> */}
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
                  <h2 className="cta-heading">
                    Let's Get Jamming !
                  </h2>
                  <p className="cta-subheading">
                    Meet people who share your taste and passion for music, have fun jamming sessions , and create unforgettable experiences together !
                  </p>
                  <div className="cta-buttons">
                    <Link href="#">
                      <button className="cta-button primary-btn">
                        Jamming Sessions Near you
                      </button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </section>
        <div className="search-bar-container">
          <h2 className="search-heading">Find Artists</h2>
          <div className="search-bar-details">
            <p>Search for your favorite artists , or checkout our featured artists . Choose what suits best for your occassion !</p>
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
          <ImageSlider images={artistImageUrls} />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LoggedInHomePage;