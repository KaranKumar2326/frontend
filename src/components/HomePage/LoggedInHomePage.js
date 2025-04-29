import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInNavbar } from '../Navbar';
import './HomePage.css';

const LoggedInHomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="page-container" style={{ textAlign: 'center', padding: '20px' }}>
      <LoggedInNavbar handleLogout={handleLogout} />
      <h1>Welcome Back!</h1>
      <p>You are successfully logged in.</p>
      <button onClick={() => navigate('/cards')} style={{ padding: '10px 20px', margin: '10px', cursor: 'pointer' }}>
        View Cards
      </button>
      <button onClick={() => navigate('/about')} style={{ padding: '10px 20px', margin: '10px', cursor: 'pointer' }}>
        About Us
      </button>
    </div>
  );
};

export default LoggedInHomePage;