import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, Alert } from '@mui/material';
import ArtistCard from './ArtistCard';
import { apiRequest } from '../api/api';
import './FeaturedArtist.css';
import './HomePage.css'; // Importing HomePage.css for the grid layout

export default function FeaturedArtists() {
  const { data: artists, isLoading } = useQuery({
    queryKey: ["/api/artists/featured"],
  });

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
