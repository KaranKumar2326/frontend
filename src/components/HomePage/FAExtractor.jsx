import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Button, Typography, Box, Grid } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import ArtistCard from './ArtistCard';
import { apiRequest } from '@/lib/api';
import './FAExtractor.css'; // Import custom styles for Featured Artists
export default function FeaturedArtists() {
  const { data: featuredArtists, isLoading, error } = useQuery({
    queryKey: ['/api/artists/featured'],
    queryFn: () => apiRequest('/api/artists/featured'),
  });

  return (
    <section className="featured-artists-section">
      <div className="container">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          mb={4}
          gap={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Featured Artists
            </Typography>
            <Typography color="textSecondary">
              Discover top-rated musicians available for your next event
            </Typography>
          </Box>
          <Button
            variant="contained"
            component={Link}
            href="/artists"
            endIcon={<ArrowRight size={16} />}
          >
            View All Artists
          </Button>
        </Box>

        {isLoading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Box
                  sx={{
                    height: 420,
                    bgcolor: 'grey.300',
                    borderRadius: 2,
                    animation: 'pulse 1.5s infinite ease-in-out',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : error ? (
          <Box textAlign="center" py={5}>
            <Typography color="textSecondary" mb={2}>
              Failed to load featured artists.
            </Typography>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {featuredArtists?.map((artist, index) => (
              <Grid item xs={12} md={6} lg={4} key={artist.id}>
                <ArtistCard artist={artist} priority={index} />
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    </section>
  );
}
