import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import bgVideo1 from '../../public/background-video1.mp4';
import bgVideo2 from '../../public/background-video2.mp4';  
import bgVideo3 from '../../public/background-video3.mp4';
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container fancy-background" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: '100vh', margin: '0 auto' }}>
      <div className="background-videos" style={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, overflow: 'hidden' }}>
        <video className="background-video" autoPlay loop muted style={{ width: '33.33%', height: '100%', objectFit: 'cover' }}>
          <source src={bgVideo1} type="video/mp4" />
        </video>
        <video className="background-video" autoPlay loop muted style={{ width: '33.33%', height: '100%', objectFit: 'cover' }}>
          <source src={bgVideo2} type="video/mp4" />
        </video>
        <video className="background-video" autoPlay loop muted style={{ width: '33.33%', height: '100%', objectFit: 'cover' }}>
          <source src={bgVideo3} type="video/mp4" />
        </video>
      </div>
      <header className="hero-section" style={{ zIndex: 1, maxWidth: '800px', padding: '20px', boxSizing: 'border-box', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        <h1 className="hero-title" style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px', fontSize: '3rem' }}>Welcome to Musical Meet</h1>
        <p className="hero-subtitle" style={{ color: 'white', fontWeight: 'bold', marginBottom: '30px', fontSize: '1.5rem' }}>
          Join us in celebrating the joy of music and connecting with artists from around the world.
        </p>
        <div className="button-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="button" style={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#ff7f50', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="button-outline" style={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '5px', backgroundColor: 'transparent', color: '#ff7f50', border: '2px solid #ff7f50', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} onClick={() => navigate('/loginAsArtist')}>
            Login as Artist
          </button>
        </div>
      </header>
      <section className="content-section" style={{ zIndex: 1, maxWidth: '800px', padding: '20px', boxSizing: 'border-box', marginTop: '40px', alignContent: 'center', textAlign: 'left', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 className="section-title" style={{ color: 'black', fontWeight: 'bold', marginBottom: '20px', fontSize: '2rem' }}>Why Join Musical Meet?</h2>
        <p className="section-text" style={{ color: 'black', fontWeight: 'bold', marginBottom: '20px', fontSize: '1.2rem' }}>
          Musical Meet is a platform where artists and music enthusiasts come together to share their passion for music. Whether you're a beginner or a professional, you'll find a welcoming community and opportunities to grow.
        </p>
        <ul className="features-list" style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🎵 Discover new genres and artists</li>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🎤 Showcase your talent</li>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🤝 Network with like-minded individuals</li>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🌟 Participate in exclusive events</li>
        </ul>
      </section>
    </div>
  );
};

export default HomePage;