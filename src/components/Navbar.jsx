// Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../public/logo.jpeg';

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();

  const logoutAndRedirect = () => {
    handleLogout();
    navigate('/Login/LoginForm');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logoImage} />
        <span style={styles.logoText}>Musical Meet</span>
      </div>
      <div style={styles.links}>
        <Link to="/home" style={styles.link}>Home</Link>
        <Link to="/cards" style={styles.link}>Find Artist</Link>
        <Link to="/about" style={styles.link}>About</Link>
        {!isLoggedIn && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <button onClick={logoutAndRedirect} style={styles.logoutButton}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    height: '60px',
    backgroundColor: '#6C2BD9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    color: 'white',
    boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoImage: {
    height: '40px',
    width: '40px',
    borderRadius: '50%',
  },
  logoText: {
    fontSize: '22px',
    fontWeight: '600',
    letterSpacing: '1px',
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    padding: '5px 15px',
    transition: 'all 0.3s ease',
    borderRadius: '4px',
  },
  logoutButton: {
    backgroundColor: '#FF595E',
    border: 'none',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
  },
};

export default Navbar;