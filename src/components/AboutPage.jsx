import React from 'react';

const AboutUsPage = () => {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2>About Us</h2>
        <p>
          Welcome to Musical Meet! We are passionate about connecting artists from all around the world!
          Whether you're a beginner or a professional, Musical Meet has a place for you!
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(-45deg, #2EC4B6, #FF6B6B, #FFD93D, #6A0572)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 15s ease infinite',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '800px',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
  }
};

// Insert keyframes manually
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default AboutUsPage;
