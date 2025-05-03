import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import CardList from '../CardList';
import './LoggedInHomePage.css'; // Updated to use the new CSS file

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

      <CardList />
      <button onClick={() => navigate('/about')} className="button">
        About Us
      </button>
    </div>
  );
};

export default LoggedInHomePage;