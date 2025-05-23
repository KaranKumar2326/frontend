import React from 'react';

const Header = () => {
  return (
    <header className="hero-section" style={{ zIndex: 1, height: '100vh', padding: '20px', boxSizing: 'border-box', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
      <div className='content'>
        <div>
          <h1 className="hero-title" style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px', fontSize: '3rem' }}>Welcome to Musical Meet</h1>
        </div>
        <div>
          <p className="hero-subtitle" style={{ color: 'white', fontWeight: 'bold', marginBottom: '30px', fontSize: '1.5rem' }}>
            Join us in celebrating the joy of music and connecting with artists from around the world.
          </p>
        </div>
        <div className="button-container" style={{ display: 'flex', gap: '10px', justifyContent: 'left' }}>
          <button className="button" style={{ padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#6c2bd9', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            Hire an Artist
          </button>
          <button className="button" style={{ padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#6c2bd9', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            Join as a Artist
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;