import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.pageContainer}>
      <header style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Welcome to Next.js Conf 2024</h1>
        <p style={styles.heroSubtitle}>Join us for an unforgettable experience of learning and networking.</p>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => navigate('/signup')}>
            Get Started
          </button>
          <button style={styles.buttonOutline} onClick={() => navigate('/about')}>
            Learn More
          </button>
        </div>
      </header>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    fontFamily: 'Arial, sans-serif',
  },
  heroSection: {
    textAlign: 'center',
    padding: '50px 20px',
    background: 'linear-gradient(135deg, #2EC4B6, #FF6B6B)',
    color: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  heroSubtitle: {
    fontSize: '18px',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#fff',
    color: '#2EC4B6',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '2px solid #fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default HomePage;
