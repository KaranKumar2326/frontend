import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import ArtistCard from './ArtistCard';
import { apiRequest } from '../api/api';
import './FeaturedArtist.css';
import './HomePage.css';

const AllArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiRequest('/api/artists')
      .then(data => {
        setArtists(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load artists.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container sx={{ mt: 5, flex: 1 }}>
        <Typography variant="h4" gutterBottom style={{ fontFamily: 'Playfair Display, serif', textAlign: 'center' }}>
          All Artists
        </Typography>
        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        <div className="featured-artists__grid" style={{ marginBottom: '40px' }}>
          {artists?.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default AllArtistsPage;
