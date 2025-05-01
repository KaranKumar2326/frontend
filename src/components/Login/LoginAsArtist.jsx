import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginAsArtist = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Logging in as Artist with:', emailOrPhone, password);
    // Here you would connect to backend API
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2>Login as Artist</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Email or Phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Login as Artist</button>
        </form>
        <p>Don't have an account? <Link to="/signup" style={styles.link}>Sign up here</Link></p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(-45deg, #6C2BD9, #FF6B6B, #FFD93D, #6A0572)',
    backgroundSize: '400% 400%',
    animation: 'gradientMove 15s ease infinite',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px',
    borderRadius: '15px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginTop: '20px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '12px 15px',
    backgroundColor: '#6C2BD9',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  link: {
    color: '#6C2BD9',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
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

export default LoginAsArtist;