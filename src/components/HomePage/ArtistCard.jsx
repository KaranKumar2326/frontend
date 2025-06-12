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
  return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
};

export default function ArtistCard({ artist, priority = 0, hidePrice = false }) {
  const navigate = useNavigate();

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="star-icon" size={18} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="star-icon" size={18} />);
    }

    return stars;
  };

  return (
    <motion
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: priority * 0.1 }}
    >
      <Card className="artist-card">
        <div className="artist-card__image-wrapper">
          <CardMedia
            component="img"
            height="200"
            image={
              getImageSrc(artist.imageUrl) ||
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
            alt={artist.stageName}
            onError={e => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"; }}
            className="artist-card__image"
          />
        </div>

        <CardContent className="artist-card__content">
          <Box className="artist-card__header">
            <Typography variant="h6" className="artist-card__name">
              {artist.stageName}
            </Typography>
            <div className="artist-card__rating-badge artist-card__header-rating">
              {renderStars(Number(artist.rating))}
              <span className="rating-number">{artist.rating}</span>
            </div>
          </Box>

          <Typography variant="body2" className="artist-card__location">
            {artist.instruments && artist.instruments.length > 0 ? artist.instruments.map((i) => i.name).join(", ") : "No instruments"}
            {artist.location ? ` | ${artist.location}` : ""}
          </Typography>

          <Box className="artist-card__badges">
            {artist.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="outlined"
                className="artist-card__badge"
              />
            ))}
          </Box>

           <Typography variant="body2" className="artist-card__bio">
              {artist.description}
            </Typography>

          <Box className="artist-card__footer" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Hide price if a prop hidePrice is passed */}
            {!hidePrice && (
              <Typography className="artist-card__price">
                {artist.pricing && artist.pricingUnit ? (
                  `$${artist.pricing}/${artist.pricingUnit}`
                ) : (
                  <span style={{ color: '#888', fontStyle: 'italic' }}>Not listed</span>
                )}
              </Typography>
            )}
            <Button
              variant="contained"
              size="small"
              className="artist-card__button"
              onClick={() => window.open(`/public-artist/${artist._id || artist.id}`, '_blank')}
            >
              View Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion>
  );
}
