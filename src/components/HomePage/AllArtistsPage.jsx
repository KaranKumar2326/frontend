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

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(4),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

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
  // Remove the direct setFilteredArtists call - let useEffect handle it
};

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                position: 'relative',
                '&:after': {
                  content: '""',
                  display: 'block',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #6c2bd9, #f0e11a)',
                  margin: '16px 0 0',
                  borderRadius: '2px'
                }
              }}
            >
              All Artists
            </Typography>
            
            <Button 
              variant="outlined" 
              startIcon={<FilterList />}
              endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                color: 'black',
                // hover
                '&:hover': {
                  color: 'black',
                  backgroundColor: '#f0e11a',
                  borderColor: '#f0e11a'
                },
                borderRadius: '50px',
                textTransform: 'none',
                px: 3,
                py: 1
              }}
            >
              Filters
            </Button>
          </Box>

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
            <Alert severity="error" sx={{ mb: 4 }}>
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
              p: 4
            }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
                No artists match your filters
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Try adjusting your filters or clear them to see all artists
              </Typography>
              <Button 
                variant="contained" 
                onClick={clearAllFilters}
                sx={{ borderRadius: '50px', px: 3, py: 1 }}
              >
                Clear all filters
              </Button>
            </Box>
          )}

          <ArtistGridContainer>
            {filteredArtists.map(artist => (
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