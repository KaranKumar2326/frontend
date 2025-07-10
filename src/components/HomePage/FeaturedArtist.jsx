import React, { useEffect, useState, useRef } from 'react';
import { Typography, Container, CircularProgress, Alert, IconButton, Box } from '@mui/material';
import ArtistCard from './ArtistCard';
import { ArrowForwardIos, ArrowBackIos, ArrowUpward, KeyboardArrowRight } from '@mui/icons-material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const HorizontalScrollContainer = styled('div')({
  display: 'flex',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  gap: '24px',
  padding: '24px 0',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
});

const ScrollButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  zIndex: 1,
  borderRadius: '50%',
  width: '48px',
  height: '48px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-50%) scale(1.05)',
  },
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'translateY(-50%) scale(0.98)',
  },
}));

const ShowMoreButton = styled('button')(({ theme }) => ({
  fontWeight: 'bold',
  padding: '20px 40px',
  fontSize: '0.9rem',
  borderRadius: '50px',
  backgroundColor: '#6c2bd9',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#5a1fc7',
  },
}));

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
}));

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArrow, setShowArrow] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const loggedInArtistId = localStorage.getItem('artist_id');
  
    fetch('https://backend-musical.onrender.com/api/artists')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(artist => artist._id !== loggedInArtistId);
        setArtists(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load artists.');
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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollButtons(true);
      // Hide buttons after 3 seconds of inactivity
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setShowScrollButtons(false), 3000);
    };

    let scrollTimeout;
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Container id="featured-artists" sx={{ mt: 8, mb: 8, position: 'relative' }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{
          textAlign: 'center',
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          mb: 6,
          color: '#444',
          position: 'relative',
          '&:after': {
            content: '""',
            display: 'block',
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #6c2bd9, #f0e11a)',
            margin: '16px auto 0',
            borderRadius: '2px',
          }
        }}
      >
        Featured Artists
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

      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%',
          '&:hover .scroll-button': {
            opacity: 1
          }
        }}
      >
        {artists.length > 0 && (
          <>
            <ScrollButton 
              onClick={scrollLeft} 
              className="scroll-button"
              sx={{ 
                left: { xs: 8, md: -48 },
                opacity: showScrollButtons ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
              aria-label="Scroll left"
            >
              <ArrowBackIos />
            </ScrollButton>
            
            <HorizontalScrollContainer ref={scrollContainerRef}>
              {artists.map(artist => (
                <Box 
                  key={artist._id} 
                  sx={{ 
                    scrollSnapAlign: 'center', 
                    flex: '0 0 auto',
                    width: { xs: '280px', sm: '300px', md: '320px' }
                  }}
                >
                  <ArtistCard artist={artist} />
                </Box>
              ))}
            </HorizontalScrollContainer>
            
            <ScrollButton 
              onClick={scrollRight} 
              className="scroll-button"
              sx={{ 
                right: { xs: 8, md: -48 },
                opacity: showScrollButtons ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
              aria-label="Scroll right"
            >
              <ArrowForwardIos />
            </ScrollButton>
          </>
        )}
      </Box>

      <Box display="flex" justifyContent="center" mt={8}>
        <ShowMoreButton onClick={() => handleNavigation('/all-artists')}>
          Show More Artists <KeyboardArrowRight sx={{ fontSize: '1.2rem' }} />
        </ShowMoreButton>
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
    </Container>
  );
};

export default FeaturedArtists;