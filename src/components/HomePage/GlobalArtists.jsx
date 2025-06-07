import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, Alert } from '@mui/material';
import GlobalArtistCard from './GlobalArtistCard';
import './FeaturedArtist.css';
import './HomePage.css';

const GlobalArtists = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/artists/global')
      .then(res => res.json())
      .then(data => {
        setArtists(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load artists.");
        setLoading(false);
      });
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom style={{fontFamily: 'Playfair Display, serif'}}>
        Global Artists
      </Typography>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <div className="featured-artists__grid">
        {(Array.isArray(artists) ? artists : []).map(artist => (
          <GlobalArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </Container>
  );
};

export default GlobalArtists;
