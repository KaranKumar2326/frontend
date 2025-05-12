import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import CardList from '../CardList';
import './LoggedInHomePage.css';
import bgVideo1 from '../../public/background-video1.mp4';
import bgVideo2 from '../../public/background-video2.mp4';
import bgVideo3 from '../../public/background-video3.mp4';

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

  return (
    <div className="page-container">
      <div className="background-videos" style={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
        <video className="background-video" autoPlay loop muted style={{ width: '33.33%', height: '100%', objectFit: 'cover' }}>
          <source src={bgVideo1} type="video/mp4" />
        </video>
        <video className="background-video" autoPlay loop muted style={{ width: '33.33%', height: '100%', objectFit: 'cover' }}>
          <source src={bgVideo2} type="video/mp4" />
        </video>
        <video className="background-video" autoPlay loop muted style={{ width: '33.33%', height: '100%', objectFit: 'cover' }}>
          <source src={bgVideo3} type="video/mp4" />
        </video>
      </div>

      <Navbar isLoggedIn={true} handleLogout={handleLogout} />

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

      <CardList />

      <div className="cta-section">
        <button onClick={() => navigate('/about')} className="button">
          About Us
        </button>
        <button onClick={() => navigate('/contact')} className="button">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default LoggedInHomePage;