import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import CardList from '../CardList';
import './LoggedInHomePage.css'; // Updated to use the new CSS file

const LoggedInHomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="page-container">
      <Navbar isLoggedIn={true} handleLogout={handleLogout} />

      <CardList />
      <button onClick={() => navigate('/about')} className="button">
        About Us
      </button>
    </div>
  );
};

export default LoggedInHomePage;