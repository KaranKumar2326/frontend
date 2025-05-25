import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, Alert } from '@mui/material';
import ArtistCard from './ArtistCard';
import { apiRequest } from '../api/api';
import './FeaturedArtist.css';
import './HomePage.css'; // Importing HomePage.css for the grid layout

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Featured Artists
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <div className="featured-artists__grid">
        {artists.map(artist => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </Container>
  );
};

export default FeaturedArtists;
