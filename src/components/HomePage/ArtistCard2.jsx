import React from "react";
import { Star, StarHalf } from "lucide-react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { styled } from '@mui/system';

// Styled components
const ArtistCardContainer = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  background: 'white',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: '16px',
    border: '1px solid rgba(108, 43, 217, 0.1)',
    pointerEvents: 'none'
  }
}));

const ArtistPhotoContainer = styled('div')({
  position: 'relative',
  paddingTop: '100%',
  overflow: 'hidden',
  background: '#f8f9fa'
});

const ArtistPhoto = styled(CardMedia)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  '&:hover': {
    transform: 'scale(1.05)'
  }
});

const ArtistGenre = styled(Chip)(({ theme }) => ({
  color: '#6c2bd9',
  fontWeight: 600,
  fontSize: '0.875rem',
  marginBottom: '1rem',
  display: 'inline-block',
  background: 'rgba(108, 43, 217, 0.1)',
  padding: '0.25rem 0.75rem',
  borderRadius: '100px',
  border: 'none'
}));

// Helper to convert Google Drive links
const getImageSrc = (url) => {
  if (!url) return null;
  let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
  if (!match) match = url.match(/[?&]id=([\w-]+)/);
  let directUrl = url;
  if (match && match[1]) {
    directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
};

export default function ArtistCard({ artist, priority = 0, hidePrice = false }) {
  const navigate = useNavigate();

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={18} fill="#FFD700" color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" size={18} fill="#FFD700" color="#FFD700" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={18} color="#e0e0e0" />);
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: priority * 0.1 }}
    >
      <ArtistCardContainer>
        <ArtistPhotoContainer>
          <ArtistPhoto
            component="img"
            image={
              getImageSrc(artist.imageUrl) ||
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
            alt={artist.stageName}
            onError={e => { 
              e.target.onerror = null; 
              e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"; 
            }}
          />
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
          }} />
        </ArtistPhotoContainer>

        <CardContent sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.75rem',
          '&:last-child': { paddingBottom: '1.75rem' }
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.5rem'
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#1e293b',
              letterSpacing: '-0.01em',
              fontFamily: 'Playfair Display, serif'
            }}>
              {artist.stageName}
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              padding: '0.25rem 0.5rem',
              borderRadius: '20px'
            }}>
              {renderStars(Number(artist.rating))}
              <Typography component="span" sx={{
                marginLeft: '4px',
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '0.9rem'
              }}>
                {artist.rating}
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {artist.genres?.slice(0, 3).map((genre) => (
              <ArtistGenre
                key={genre.id}
                label={genre.name}
                size="small"
              />
            ))}
            {artist.genres?.length > 3 && (
              <ArtistGenre
                label={`+${artist.genres.length - 3}`}
                size="small"
              />
            )}
          </Box>

          <Typography variant="body2" sx={{
            color: '#64748b',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            marginBottom: '0.5rem',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {Array.isArray(artist.instruments)
              ? (artist.instruments.map(i => (i && i.name ? i.name : ''))
                  .filter(Boolean).length > 0
                ? artist.instruments.map(i => (i && i.name ? i.name : ''))
                    .filter(Boolean)
                    .join(', ')
                : (artist.instruments.length > 0 ? 'N/A' : 'No instruments listed.'))
              : 'No instruments listed.'}
          </Typography>

          <Typography variant="body2" sx={{
            color: '#64748b',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {artist.description || "No description available"}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: 'auto'
          }}>
            {!hidePrice && (
              <Typography sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '1rem'
              }}>
                {artist.pricing && artist.pricingUnit ? (
                  `₹${artist.pricing}/${artist.pricingUnit}`
                ) : (
                  <span style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>Not listed</span>
                )}
              </Typography>
            )}
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/public-artist/${artist._id || artist.id}`)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                padding: '8px 16px',
                backgroundColor: '#6c2bd9',
                '&:hover': {
                  backgroundColor: '#5a1fc7'
                }
              }}
            >
              View Profile
            </Button>
          </Box>
        </CardContent>
      </ArtistCardContainer>
    </motion.div>
  );
}