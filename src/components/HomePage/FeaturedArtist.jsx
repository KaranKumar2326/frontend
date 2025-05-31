import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, Alert } from '@mui/material';
import ArtistCard from './ArtistCard';
import { apiRequest } from '../api/api';
import './FeaturedArtist.css';
import './HomePage.css'; // Importing HomePage.css for the grid layout
import { useQuery } from '@tanstack/react-query';

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    apiRequest('/api/artists/featured')  // Removed <ArtistWithDetails[]>
      .then(data => {
        setArtists(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load artists.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Container id="featured-artists" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom style={{fontFamily: 'Playfair Display, serif', textAlign: 'center'}}>
        Featured Artists
      </Typography>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <div className="featured-artists__grid">  
        {artists?.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <button
          className="P"
          style={{fontWeight:'bold', padding: '20px 40px', fontSize: '0.9rem', borderRadius: '5px', backgroundColor: '#6c2bd9', color: 'white', border: '3px', borderColor:'#f0e11a', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'}}
          onClick={() => window.open('/all-artists', '_blank')}
        >
          Show More Artists
        </button>
      </div>
      {/* Back to top arrow button, fixed in bottom right */}
      {showArrow && (
        <button
          aria-label="Back to top"
          className="back-to-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span className="back-to-top-arrow">↑</span>
        </button>
      )}
    </Container>
  );
};

export default FeaturedArtists;