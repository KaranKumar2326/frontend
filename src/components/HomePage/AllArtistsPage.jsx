import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  CircularProgress, 
  Alert, 
  Box,
  IconButton,
  Chip,
  Button,
  Slider,
  Input,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Divider,
  Paper,
  Collapse
} from '@mui/material';
import { 
  ArrowUpward,
  FilterList,
  Close,
  ExpandMore,
  ExpandLess 
} from '@mui/icons-material';
import ArtistCard from './ArtistCard2';
import ArtistCard3 from './ArtistCard3';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';
import { styled } from '@mui/system';

const ArtistGridContainer = styled('div')({
  display: 'grid',
  padding: '1rem 0',
  width: '100%',
  
  // Mobile: 2 columns with equal width and proper gap
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  
  // Tablet: 3 columns
  '@media (min-width: 768px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    padding: '1.5rem 0',
  },
  
  // Desktop: 4 columns with consistent sizing
  '@media (min-width: 1024px)': {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    padding: '2rem 0',
  },
  
  // Large desktop: 5 columns
  '@media (min-width: 1400px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
  }
});

// Enhanced Mobile Card Wrapper with proper responsive design
const MobileCardWrapper = styled('div')({
  width: '100%',
  
  // Mobile styles - compact but readable
  '@media (max-width: 767px)': {
    '& .MuiCard-root': {
      height: '100%',
      minHeight: '280px',
      width: '100%',
      margin: '0',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      }
    },
    
    // Card image on mobile
    '& .artist-card-image': {
      height: '120px !important',
      width: '100%',
      objectFit: 'cover',
      borderRadius: '12px 12px 0 0',
    },
    
    // Card content on mobile
    '& .MuiCardContent-root': {
      padding: '12px !important',
      paddingBottom: '12px !important',
      height: 'calc(100% - 120px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    
    // Typography on mobile
    '& .artist-name': {
      fontSize: '0.875rem !important',
      fontWeight: '600 !important',
      lineHeight: '1.2 !important',
      marginBottom: '4px !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    '& .artist-genres': {
      fontSize: '0.75rem !important',
      color: '#666 !important',
      marginBottom: '4px !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    '& .artist-location': {
      fontSize: '0.75rem !important',
      color: '#888 !important',
      marginBottom: '6px !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    '& .artist-rating': {
      fontSize: '0.75rem !important',
      marginBottom: '6px !important',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    
    '& .artist-price': {
      fontSize: '0.875rem !important',
      fontWeight: '600 !important',
      color: '#6c2bd9 !important',
      marginBottom: '8px !important',
    },
    
    // Button on mobile
    '& .MuiButton-root': {
      fontSize: '0.75rem !important',
      padding: '6px 12px !important',
      minHeight: '32px !important',
      borderRadius: '16px !important',
      width: '100%',
      marginTop: 'auto',
    },
    
    // Chips on mobile
    '& .MuiChip-root': {
      fontSize: '0.625rem !important',
      height: '20px !important',
      '& .MuiChip-label': {
        padding: '0 6px !important',
      }
    },
  },
  
  // Tablet styles
  '@media (min-width: 768px) and (max-width: 1023px)': {
    '& .MuiCard-root': {
      height: '100%',
      minHeight: '350px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      }
    },
    
    '& .artist-card-image': {
      height: '160px !important',
    },
    
    '& .MuiCardContent-root': {
      padding: '16px !important',
      height: 'calc(100% - 160px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    
    '& .artist-name': {
      fontSize: '1rem !important',
      fontWeight: '600 !important',
      lineHeight: '1.3 !important',
      marginBottom: '6px !important',
    },
    
    '& .artist-genres': {
      fontSize: '0.875rem !important',
      color: '#666 !important',
      marginBottom: '8px !important',
    },
    
    '& .artist-location': {
      fontSize: '0.875rem !important',
      color: '#888 !important',
      marginBottom: '10px !important',
    },
    
    '& .artist-rating': {
      fontSize: '0.875rem !important',
      marginBottom: '10px !important',
    },
    
    '& .artist-price': {
      fontSize: '1rem !important',
      fontWeight: '600 !important',
      color: '#6c2bd9 !important',
      marginBottom: '12px !important',
    },
    
    '& .MuiButton-root': {
      fontSize: '0.875rem !important',
      padding: '8px 16px !important',
      minHeight: '36px !important',
      borderRadius: '18px !important',
      marginTop: 'auto',
    },
  },
  
  // Desktop styles - consistent card heights
  '@media (min-width: 1024px)': {
    '& .MuiCard-root': {
      height: '100%',
      minHeight: '400px',
      borderRadius: '20px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
      }
    },
    
    '& .artist-card-image': {
      height: '200px !important',
      width: '100%',
      objectFit: 'cover',
      borderRadius: '20px 20px 0 0',
    },
    
    '& .MuiCardContent-root': {
      padding: '20px !important',
      paddingBottom: '20px !important',
      height: 'calc(100% - 200px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flex: 1,
    },
    
    '& .artist-name': {
      fontSize: '1.125rem !important',
      fontWeight: '600 !important',
      lineHeight: '1.4 !important',
      marginBottom: '8px !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    '& .artist-genres': {
      fontSize: '0.875rem !important',
      color: '#666 !important',
      marginBottom: '10px !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    '& .artist-location': {
      fontSize: '0.875rem !important',
      color: '#888 !important',
      marginBottom: '12px !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    
    '& .artist-rating': {
      fontSize: '0.875rem !important',
      marginBottom: '12px !important',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    
    '& .artist-price': {
      fontSize: '1.125rem !important',
      fontWeight: '600 !important',
      color: '#6c2bd9 !important',
      marginBottom: '16px !important',
    },
    
    '& .MuiButton-root': {
      fontSize: '0.875rem !important',
      padding: '10px 20px !important',
      minHeight: '40px !important',
      borderRadius: '20px !important',
      width: '100%',
      marginTop: 'auto',
    },
    
    '& .MuiChip-root': {
      fontSize: '0.75rem !important',
      height: '24px !important',
      '& .MuiChip-label': {
        padding: '0 8px !important',
      }
    },
  }
});

const BackToTopButton = styled(IconButton)(({ theme }) => ({
  position: 'fixed',
  bottom: '32px',
  right: '32px',
  backgroundColor: '#6c2bd9',
  color: 'white',
  width: '56px',
  height: '56px',
  '&:hover': {
    backgroundColor: '#5a1fc7',
  },
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 16px rgba(108, 43, 217, 0.3)',
  zIndex: 1000,
  
  // Smaller on mobile
  '@media (max-width: 767px)': {
    bottom: '20px',
    right: '20px',
    width: '48px',
    height: '48px',
  }
}));

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(108, 43, 217, 0.1)',
  
  // Adjust for mobile
  '@media (max-width: 767px)': {
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
  }
}));

const MobileContainer = styled(Container)({
  // Proper mobile padding
  '@media (max-width: 767px)': {
    paddingLeft: '16px !important',
    paddingRight: '16px !important',
    maxWidth: '100% !important',
  },
  
  // Tablet padding
  '@media (min-width: 768px) and (max-width: 1023px)': {
    paddingLeft: '24px !important',
    paddingRight: '24px !important',
  },
  
  // Desktop padding
  '@media (min-width: 1024px)': {
    paddingLeft: '32px !important',
    paddingRight: '32px !important',
  }
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '2rem',
  
  '@media (max-width: 767px)': {
    marginBottom: '1.5rem',
  }
});

const AllArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArrow, setShowArrow] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [uniqueGenres, setUniqueGenres] = useState([]);
  const [uniqueInstruments, setUniqueInstruments] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const containerRef = useRef(null);

  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedInstruments, setSelectedInstruments] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setShowArrow(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loggedInArtistId = localStorage.getItem('artist_id');

    fetch('https://backend-musical.onrender.com/api/artists')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(artist => artist._id !== loggedInArtistId);
        setArtists(filtered);
        setFilteredArtists(filtered);
        extractUniqueValues(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load artists.');
        setLoading(false);
      });
  }, []);

  const extractUniqueValues = (artistsData) => {
    const genres = new Set();
    const instruments = new Set();
    const locations = new Set();

    artistsData.forEach(artist => {
      // Extract genres
      if (Array.isArray(artist.genres)) {
        artist.genres.forEach(genre => {
          if (genre?.name) genres.add(genre.name);
        });
      }

      // Extract instruments
      if (Array.isArray(artist.instruments)) {
        artist.instruments.forEach(instrument => {
          if (instrument?.name) instruments.add(instrument.name);
        });
      }

      // Extract locations
      if (artist.location) {
        locations.add(artist.location);
      }
    });

    setUniqueGenres(Array.from(genres).sort());
    setUniqueInstruments(Array.from(instruments).sort());
    setUniqueLocations(Array.from(locations).sort());
  };

  const applyFilters = () => {
    let result = [...artists];

    // Filter by genres
    if (selectedGenres.length > 0) {
      result = result.filter(artist => {
        if (!Array.isArray(artist.genres)) return false;
        return artist.genres.some(genre => 
          genre?.name && selectedGenres.includes(genre.name)
        );
      });
    }

    // Filter by instruments
    if (selectedInstruments.length > 0) {
      result = result.filter(artist => {
        if (!Array.isArray(artist.instruments)) return false;
        return artist.instruments.some(instrument => 
          instrument?.name && selectedInstruments.includes(instrument.name)
        );
      });
    }

    // Filter by location
    if (selectedLocations.length > 0) {
      result = result.filter(artist => 
        artist.location && selectedLocations.includes(artist.location)
      );
    }

    // Filter by price range - only apply if range is not the default/maximum range
    if (priceRange[0] > 0 || priceRange[1] < 10000) {
      result = result.filter(artist => {
        if (!artist.pricing && artist.pricing !== 0) return false;
        return artist.pricing >= priceRange[0] && artist.pricing <= priceRange[1];
      });
    }

    // Filter by rating - only apply if rating filter is set
    if (ratingFilter > 0) {
      result = result.filter(artist => {
        if (!artist.rating && artist.rating !== 0) return false;
        return Number(artist.rating) >= ratingFilter;
      });
    }

    setFilteredArtists(result);
  };

  useEffect(() => {
    if (artists.length > 0) {
      applyFilters();
    }
  }, [selectedGenres, selectedInstruments, selectedLocations, priceRange, ratingFilter, artists]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handlePriceInputChange = (index) => (event) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    const newPriceRange = [...priceRange];
    newPriceRange[index] = value;
    setPriceRange(newPriceRange);
  };

  const handleRatingChange = (event, newValue) => {
    setRatingFilter(newValue);
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedInstruments([]);
    setSelectedLocations([]);
    setPriceRange([0, 10000]);
    setRatingFilter(0);
  };

  return (
    <>
      <NavigationBar />
      <Box 
        ref={containerRef}
        sx={{ 
          backgroundColor: '#fafafa',
          minHeight: '100vh',
          pt: { xs: 6, sm: 8 },
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
        <MobileContainer maxWidth="xl">
          <HeaderSection>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6c2bd9 0%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                marginBottom: 1,
                fontSize: { xs: '1.75rem', sm: '2.125rem' }
              }}
            >
              Discover Amazing Artists
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Find the perfect artist for your next event
            </Typography>
          </HeaderSection>

          <Collapse in={showFilters}>
            <FilterContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Filter Artists</Typography>
                <Button 
                  size="small" 
                  onClick={clearAllFilters}
                  startIcon={<Close />}
                  sx={{ textTransform: 'none' }}
                >
                  Clear all
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {/* Genres Filter */}
                <FormControl fullWidth size="small">
                  <InputLabel>Genres</InputLabel>
                  <Select
                    multiple
                    value={selectedGenres}
                    onChange={(e) => setSelectedGenres(e.target.value)}
                    input={<Input />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {uniqueGenres.map((genre) => (
                      <MenuItem key={genre} value={genre}>
                        <Checkbox checked={selectedGenres.indexOf(genre) > -1} />
                        <ListItemText primary={genre} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Instruments Filter */}
                <FormControl fullWidth size="small">
                  <InputLabel>Instruments</InputLabel>
                  <Select
                    multiple
                    value={selectedInstruments}
                    onChange={(e) => setSelectedInstruments(e.target.value)}
                    input={<Input />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {uniqueInstruments.map((instrument) => (
                      <MenuItem key={instrument} value={instrument}>
                        <Checkbox checked={selectedInstruments.indexOf(instrument) > -1} />
                        <ListItemText primary={instrument} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Locations Filter */}
                <FormControl fullWidth size="small">
                  <InputLabel>Locations</InputLabel>
                  <Select
                    multiple
                    value={selectedLocations}
                    onChange={(e) => setSelectedLocations(e.target.value)}
                    input={<Input />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {uniqueLocations.map((location) => (
                      <MenuItem key={location} value={location}>
                        <Checkbox checked={selectedLocations.indexOf(location) > -1} />
                        <ListItemText primary={location} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Price Range Filter */}
                <Box>
                  <Typography gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                    Price Range (₹{priceRange[0]} - ₹{priceRange[1]})
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10000}
                    step={100}
                    sx={{ width: '95%' }}
                  />
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Input
                      value={priceRange[0]}
                      onChange={handlePriceInputChange(0)}
                      inputProps={{
                        min: 0,
                        max: priceRange[1],
                        type: 'number',
                      }}
                      sx={{ width: '80px' }}
                    />
                    <Input
                      value={priceRange[1]}
                      onChange={handlePriceInputChange(1)}
                      inputProps={{
                        min: priceRange[0],
                        max: 10000,
                        type: 'number',
                      }}
                      sx={{ width: '80px' }}
                    />
                  </Box>
                </Box>

                {/* Rating Filter */}
                <Box>
                  <Typography gutterBottom sx={{ fontWeight: 500, mb: 1 }}>
                    Minimum Rating ({ratingFilter > 0 ? `${ratingFilter}+` : 'Any'})
                  </Typography>
                  <Slider
                    value={ratingFilter}
                    onChange={handleRatingChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={5}
                    step={0.5}
                    marks={[
                      { value: 0, label: 'Any' },
                      { value: 5, label: '5' }
                    ]}
                    sx={{ width: '95%' }}
                  />
                </Box>
              </Box>
            </FilterContainer>
          </Collapse>

          {isLoading && (
            <Box display="flex" justifyContent="center" my={8}>
              <CircularProgress size={60} thickness={4} sx={{ color: '#6c2bd9' }} />
            </Box>
          )}
          
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {!isLoading && !error && filteredArtists.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '300px',
              textAlign: 'center',
              p: 4,
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                No artists match your filters
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Try adjusting your filters or clear them to see all artists
              </Typography>
              <Button 
                variant="contained" 
                onClick={clearAllFilters}
                sx={{ 
                  borderRadius: '25px', 
                  px: 4, 
                  py: 1.5,
                  background: 'linear-gradient(135deg, #6c2bd9 0%, #8b5cf6 100%)',
                  boxShadow: '0 4px 16px rgba(108, 43, 217, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(108, 43, 217, 0.4)',
                  }
                }}
              >
                Clear all filters
              </Button>
            </Box>
          )}

          {!isLoading && !error && filteredArtists.length > 0 && (
            <>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {filteredArtists.length} artists found
                </Typography>
                <Button
                  startIcon={<FilterList />}
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outlined"
                  sx={{ 
                    borderRadius: '20px',
                    borderColor: '#6c2bd9',
                    color: '#6c2bd9',
                    '&:hover': {
                      borderColor: '#5a1fc7',
                      backgroundColor: 'rgba(108, 43, 217, 0.04)',
                    }
                  }}
                >
                  Filters
                </Button>
              </Box>

              <MobileCardWrapper>
                <ArtistGridContainer>
                  {filteredArtists.map(artist => (
                    <ArtistCard3 key={artist._id} artist={artist} />
                  ))}
                </ArtistGridContainer>
              </MobileCardWrapper>
            </>
          )}
        </MobileContainer>
      </Box>

      {showArrow && (
        <BackToTopButton 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUpward />
        </BackToTopButton>
      )}
      
      <Footer />
    </>
  );
};

export default AllArtistsPage;