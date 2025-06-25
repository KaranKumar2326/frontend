import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import ArtistCard from './ArtistCard';
import './FeaturedArtist.css';
import './HomePage.css';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';

const AllArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/artists')
      .then(res => res.json())
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
    <>
      <NavigationBar />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container sx={{ mt: 5, flex: 1 }}>
          <Typography variant="h4" gutterBottom style={{ fontFamily: 'Playfair Display, serif', textAlign: 'center' }}>
            All Artists
          </Typography>
          {isLoading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          <div className="featured-artists__grid" style={{ marginBottom: '40px' }}>
            {artists?.map(artist => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </div>
        </Container>
      </div>
      <Footer/>
    </>
  );
};

export default AllArtistsPage;
