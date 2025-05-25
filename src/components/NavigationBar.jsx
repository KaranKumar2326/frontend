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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a className="navbar-brand">
            <span className="navbar-title">Musical Meet</span>
          </a>
        </div>
        <div className="navbar-as">
          <Link to="/home" className="navbar-a">Home</Link>
          <Link to="/cards" className="navbar-a">Browse Artists</Link>
          <a className="navbar-a">How It Works</a>
          <a className="navbar-a">Testimonials</a>
          {location.pathname !== '/home' && (
            <>
              <button className="navbar-button" onClick={() => navigate('/login')}>Hire an Artist</button>
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