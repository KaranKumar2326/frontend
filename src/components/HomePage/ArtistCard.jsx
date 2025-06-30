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
import "./ArtistCard.css"; // Custom CSS styles
import myImage from "../../public/defaultpic.png"

// Helper to convert Google Drive links to direct image links and proxy through backend
const getImageSrc = (url) => {
  if (!url) return null;
  let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
  if (!match) {
    match = url.match(/[?&]id=([\w-]+)/);
  }
  let directUrl = url;
  if (match && match[1]) {
    directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  // Always proxy through backend for CORS
  return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
};

export default function ArtistCard({ artist, priority = 0, hidePrice = false }) {
  const navigate = useNavigate();

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="star-icon" size={18} fill="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="star-icon" size={18} fill="#FFD700" />);
    }

    // Add empty stars for remaining
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star-icon" size={18} color="#e0e0e0" />);
    }

    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: priority * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
    >
      <Card className="artist-card" sx={{ 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}>
        <div className="artist-card__image-wrapper" style={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="240"
            image={
              getImageSrc(artist.imageUrl) || myImage
            }
            alt={artist.stageName}
            onError={e => { e.target.onerror = null; e.target.src = myImage; }}
            className="artist-card__image"
            sx={{
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              objectFit: 'cover',
              width: '100%'
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
        </div>

        <CardContent className="artist-card__content" sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px'
        }}>
          <Box className="artist-card__header" sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px'
          }}>
            <Typography variant="h6" className="artist-card__name" sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              color: '#333',
              lineHeight: 1.3
            }}>
              {artist.stageName}
            </Typography>
            <div className="artist-card__rating-badge artist-card__header-rating" style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              padding: '4px 8px',
              borderRadius: '20px'
            }}>
              {renderStars(Number(artist.rating))}
              <span className="rating-number" style={{
                marginLeft: '4px',
                fontWeight: 600,
                color: '#333',
                fontSize: '0.9rem'
              }}>{artist.rating}</span>
            </div>
          </Box>

          <Typography variant="body2" className="artist-card__location" sx={{
            color: '#666',
            fontSize: '0.85rem',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {artist.instruments && artist.instruments.length > 0 ? artist.instruments.map((i) => i.name).join(", ") : "No instruments"}
            {artist.location && (
              <>
                <span style={{ color: '#ddd', margin: '0 4px' }}>•</span>
                {artist.location}
              </>
            )}
          </Typography>

          <Box className="artist-card__badges" sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '12px'
          }}>
            {artist.genres?.slice(0, 3).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="outlined"
                className="artist-card__badge"
                sx={{
                  borderRadius: '6px',
                  borderColor: '#e0e0e0',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  color: '#555',
                  fontSize: '0.75rem',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.05)'
                  }
                }}
              />
            ))}
            {artist.genres?.length > 3 && (
              <Chip
                label={`+${artist.genres.length - 3}`}
                size="small"
                variant="outlined"
                sx={{
                  borderRadius: '6px',
                  borderColor: '#e0e0e0',
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  color: '#555',
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Box>

          <Typography variant="body2" className="artist-card__bio" sx={{
            color: '#555',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexGrow: 1
          }}>
            {artist.description || "No description available"}
          </Typography>

          <Box className="artist-card__footer" sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: 'auto'
          }}>
            {!hidePrice && (
              <Typography className="artist-card__price" sx={{
                fontWeight: 600,
                color: '#333',
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
              className="artist-card__button"
              onClick={() => navigate(`/public-artist/${artist._id || artist.id}`)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                padding: '6px 16px',
                backgroundColor: '#3f51b5',
                '&:hover': {
                  backgroundColor: '#303f9f'
                }
              }}
            >
              View Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}