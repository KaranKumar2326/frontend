import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button, Skeleton, Box, Typography, Grid } from "@mui/material";
import ArtistCard from "./ArtistCard";
import "./FeaturedArtist.css";

export default function FeaturedArtists() {
  const { data: artists, isLoading } = useQuery({
    queryKey: ["/api/artists/featured"],
  });

  return (
    <section id="artists" className="featured-artists-section">
      <div className="featured-artists-container">
        <div className="featured-artists-header">
          <Typography variant="h4" className="featured-artists-title">
            Featured Artists
          </Typography>
          <Typography variant="body1" className="featured-artists-subtitle">
            Discover our top-rated music professionals with exceptional portfolios and client reviews.
          </Typography>
        </div>

        <Grid container spacing={4} className="featured-artists-grid">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Grid item xs={12} md={6} lg={4} key={i}>
                  <Box className="featured-artists-skeleton-card">
                    <Skeleton variant="rectangular" height={256} />
                    <Box p={2}>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Skeleton variant="text" width={120} height={28} />
                        <Skeleton variant="text" width={80} height={24} />
                      </Box>
                      <Skeleton variant="text" width={150} height={20} />
                      <Skeleton variant="rectangular" height={64} sx={{ my: 2 }} />
                      <Box display="flex" gap={1} mb={2}>
                        <Skeleton variant="rounded" width={64} height={24} />
                        <Skeleton variant="rounded" width={80} height={24} />
                        <Skeleton variant="rounded" width={96} height={24} />
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Skeleton variant="text" width={80} height={28} />
                        <Skeleton variant="rectangular" width={112} height={40} />
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))
            : artists?.map((artist, index) => (
                <Grid item xs={12} md={6} lg={4} key={artist.id}>
                  <ArtistCard artist={artist} priority={index} />
                </Grid>
              ))}
        </Grid>

        <div className="featured-artists-button-wrapper">
          <Link href="/artists">
            <Button variant="contained" size="large" className="featured-artists-button">
              View All Artists
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
