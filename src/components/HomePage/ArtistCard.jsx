import React from 'react';
import { Link } from 'wouter';
import { Star, StarHalf } from 'lucide-react';
import { Card, CardContent, CardActions, CardMedia, Typography, Chip, Box, Badge as MuiBadge } from '@mui/material';
import { motion } from 'framer-motion';
import './ArtistCard.css';  // your CSS import

const MotionCard = motion(Card);

export default function ArtistCard({ artist, priority = 0, animated = true }) {
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="star-icon" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="star-icon" />);
    }
    return stars;
  };

  const formatCurrency = (value) => {
    if (!value) return '$0';
    return `$${value.toFixed(2)}`;
  };

  return animated ? (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: priority * 0.1 }}
      className="artist-card"
      component={Link}
      href={`/artists/${artist.id}`}
      elevation={4}
    >
      {(artist.coverImage || artist.imageUrl) && (
        <Box className="artist-card__image-wrapper">
          <CardMedia
            component="img"
            className="artist-card__image"
            image={artist.coverImage || artist.imageUrl}
            alt={artist.stageName}
            loading={priority <= 3 ? 'eager' : 'lazy'}
          />
          <Box className="artist-card__rating">
            <MuiBadge
              badgeContent={renderStars(artist.rating)}
              color="secondary"
              className="artist-card__rating-badge"
              sx={{ '& .MuiBadge-badge': { backgroundColor: 'transparent' } }}
            />
            <Typography component="span" sx={{ ml: 0.5, fontSize: '0.875rem' }}>
              {artist.rating ? artist.rating.toFixed(1) : '0.0'}
            </Typography>
          </Box>
        </Box>
      )}

      <CardContent className="artist-card__content">
        <Box className="artist-card__header">
          <Typography variant="h6" className="artist-card__name">
            {artist.stageName}
          </Typography>
          <Typography variant="subtitle2" className="artist-card__price">
            {formatCurrency(artist.pricePerHour || artist.pricing)}/
            {artist.pricingUnit || 'hr'}
          </Typography>
        </Box>

        <Typography className="artist-card__location">
          {artist.user?.location || artist.location || 'Location not specified'}
        </Typography>

        <Box className="artist-card__badges">
          {artist.genres?.map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              variant="outlined"
              size="small"
              className="artist-card__badge"
            />
          ))}
        </Box>

        <Box className="artist-card__badges">
          {artist.instruments?.map((instrument) => (
            <Chip
              key={instrument.id || instrument.name}
              label={instrument.name}
              color="secondary"
              size="small"
              className="artist-card__badge"
            />
          ))}
        </Box>
      </CardContent>

      <CardActions className="artist-card__footer">
        <Typography variant="body2" className="artist-card__bio">
          {artist.bio || artist.description || ''}
        </Typography>
      </CardActions>
    </MotionCard>
  ) : (
    <Card className="artist-card" component={Link} href={`/artists/${artist.id}`} elevation={4}>
      {/* Non-animated version can be added here if needed */}
    </Card>
  );
}
