import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import myImage from '../public/logo.jpeg';
import './NavigationBar.css'; // Updated to use NavigationBar.css instead of LoggedInHomePage.css

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  // Helper function for smooth scrolling
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="navbar-title">Musical Meet</span>
          </a>
        </div>
        <div className="navbar-as">
          <a className="navbar-a">Home</a>
          <a className="navbar-a" href="#how-it-works" onClick={e => { e.preventDefault(); scrollToSection('how-it-works'); }}>How It Works</a>
          <a className="navbar-a" href="#testimonials" onClick={e => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a>
          {/* Hide Browse Artists, Hire an Artist, and profile icon on Signup page */}
          {location.pathname !== '/signup' && location.pathname !== '/home' && location.pathname !== '/loggedInHomePageArtist' && (
            <>
              <a className="navbar-a" href="#featured-artists" onClick={e => { e.preventDefault(); scrollToSection('featured-artists'); }}>Browse Artists</a>
              <button className="navbar-button" onClick={() => navigate('/login')}>Hire an Artist</button>
              <img src={myImage} className="user-pfp" onClick={() => setOpenProfile((prev) => !prev)} />
            </>
          )}
          {location.pathname === '/loggedInHomePageArtist' && (
            <>
              <button className="navbar-button" onClick={() => navigate('/login')}>Inquiries</button>
              <img src={myImage} className="user-pfp" onClick={() => setOpenProfile((prev) => !prev)} />
            </>
          )}
          {openProfile && (
            <div className="flex flex-col dropdown">
              <ul className="dropcont">
                <li>My Profile</li>
                <li>Settings</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;