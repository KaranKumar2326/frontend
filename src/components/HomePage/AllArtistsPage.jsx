import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Box,
  IconButton
} from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import ArtistCard from './ArtistCard2';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';
import { styled } from '@mui/system';

const ArtistGridContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '2rem',
  padding: '2rem 0',
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2.5rem',
  }
});

const BackToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '32px',
  right: '32px',
  backgroundColor: '#6c2bd9',
  color: 'white',
  '&:hover': {
    backgroundColor: '#5a1fc7',
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  zIndex: 1000,
}));

const AllArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArrow, setShowArrow] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('https://backend-musical.onrender.com/api/artists')
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
      <Box 
        ref={containerRef}
        sx={{ 
          backgroundColor: '#fafafa',
          minHeight: '100vh',
          pt: 8,
          pb: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(108, 43, 217, 0.1), transparent)'
          }
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{
              textAlign: 'center',
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700,
              mb: 6,
              position: 'relative',
              '&:after': {
                content: '""',
                display: 'block',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, #6c2bd9, #f0e11a)',
                margin: '16px auto 0',
                borderRadius: '2px'
              }
            }}
          >
            All Artists
          </Typography>

          {isLoading && (
            <Box display="flex" justifyContent="center" my={8}>
              <CircularProgress size={60} thickness={4} sx={{ color: '#6c2bd9' }} />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          <ArtistGridContainer>
            {artists.map(artist => (
              <ArtistCard key={artist._id} artist={artist} />
            ))}
          </ArtistGridContainer>
        </Container>
      </Box>

      {showArrow && (
        <BackToTopButton 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          size="large"
        >
          <ArrowUpward />
        </BackToTopButton>
      )}
      
      <Footer />
    </>
  );
};

export default AllArtistsPage;