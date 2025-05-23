import React, { useEffect, useState } from 'react';
import { Grid, Typography, Container, CircularProgress, Alert } from '@mui/material';
import ArtistCard from './ArtistCard';
import { apiRequest } from '../api/api';
import './FeaturedArtist.css';

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

      <Grid container spacing={2}>
        {artists.map(artist => (
          <Grid item xs={12} sm={6} md={4} key={artist.id}>
            <ArtistCard artist={artist} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturedArtists;
