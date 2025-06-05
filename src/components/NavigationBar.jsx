import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import myImage from '../public/logo.jpeg';
import './NavigationBar.css'; // Updated to use NavigationBar.css instead of LoggedInHomePage.css
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast notifications

const NavigationBar = ({ hideProfile = false }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [openProfile, setOpenProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('token'); // If you are storing the token too
    localStorage.removeItem('userId'); // Remove userId if stored
    toast.success('Logged out successfully');
    console.log('User logged out');
    navigate('/login');
  };

  // Helper function for smooth scrolling
  const scrollToSection = (id) => {
    // Try to scroll to the element, and if not found, try scrolling to the footer tag
    let el = document.getElementById(id);
    if (!el && id === 'footer') {
      el = document.querySelector('footer');
    }
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hide nav items on artist profile page
  const isArtistProfilePage = location.pathname.startsWith('/artist-profile/');

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
          <a className="navbar-a" href="#footer" onClick={e => { e.preventDefault(); scrollToSection('footer'); }}>Contact Us</a>
          <a className="navbar-a" href="#testimonials" onClick={e => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a>
          {/* Hide Browse Artists and Hire an Artist on Signup and artist profile page, but keep profile pic and dropdown on artist profile page */}
          {location.pathname !== '/signup' && location.pathname !== '/home' && location.pathname !== '/loggedInHomePageArtist' && !isArtistProfilePage && (
            <>
              <a className="navbar-a" href="#featured-artists" onClick={e => { e.preventDefault(); scrollToSection('featured-artists'); }}>Browse Artists</a>
              <button className="navbar-button" onClick={() => navigate('/login')}>Hire an Artist</button>
              {/* Only show Sign Up button if hideProfile is true (i.e., HomePage.js) */}
              {hideProfile && (
                <button className="navbar-button" onClick={() => navigate('/signup')}>Sign Up</button>
              )}
            </>
          )}
          {/* Always show profile pic and dropdown except on signup/home/artist home */}
          {location.pathname !== '/signup' && location.pathname !== '/home' && location.pathname !== '/loggedInHomePageArtist' && (
            !hideProfile && (
              <img src={myImage} className="user-pfp" onClick={() => setOpenProfile((prev) => !prev)} />
            )
          )}
          {location.pathname === '/loggedInHomePageArtist' && (
            <>
              <button className="navbar-button" onClick={() => navigate('/login')}>Inquiries</button>
              {!hideProfile && (
                <img src={myImage} className="user-pfp" onClick={() => setOpenProfile((prev) => !prev)} />
              )}
            </>
          )}
          {!hideProfile && openProfile && (
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