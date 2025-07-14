import React from "react";
import { Star, StarHalf } from "lucide-react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  useTheme
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import myImage from "../../public/defaultpic.png";

const getImageSrc = (url) => {
  if (!url) return null;
  let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
  if (!match) {
    match = url.match(/[?&]id=([\w-]+)/);
  }
  let directUrl = url;
  console.log(directUrl);
  if (match && match[1]) {
    directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  // Always proxy through backend for CORS
  return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
};

const ArtistCard = ({ artist, priority = 0, hidePrice = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} size={18} fill="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" size={18} fill="#FFD700" />);
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
      whileHover={{ y: -5 }}
      style={{ height: "100%" }}
    >
      <Card 
        sx={{ 
          borderRadius: '12px',
          boxShadow: theme.shadows[2],
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '480px',
          '&:hover': {
            boxShadow: theme.shadows[6],
            transform: 'translateY(-2px)'
          }
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          {/* <CardMedia
            component="img"
            height="240"
            image={getImageSrc(artist.imageUrl) }
            alt={artist.stageName}
            onError={e => { e.target.onerror = null; e.target.src = myImage; }}
            sx={{
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              objectFit: 'cover',
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)'
              }
            }}
          /> */}
          <img
                          src={artist.imageUrl ? getImageSrc(artist.imageUrl) : undefined}
                          alt="Profile"
                          crossOrigin='Anonymous'
                          className="artist-profile-img"
                          style={{ borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              objectFit: 'cover',
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.03)'
              } }}
                          
                        />
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
          }} />
        </Box>

        <CardContent sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          '&:last-child': { pb: 3 }
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1.5
          }}>
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 600,
                fontSize: '1.1rem',
                lineHeight: 1.3,
                color: theme.palette.text.primary
              }}
            >
              {artist.stageName}
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'rgba(255, 215, 0, 0.1)',
              px: 1,
              py: 0.5,
              borderRadius: '20px'
            }}>
              {renderStars(Number(artist.rating))}
              <Typography variant="body2" sx={{ 
                ml: 0.5, 
                fontWeight: 600,
                color: theme.palette.text.primary
              }}>
                {artist.rating}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.85rem',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {Array.isArray(artist.instruments)
              ? artist.instruments.filter(i => i?.name).length > 0
                ? artist.instruments.map(i => i?.name).filter(Boolean).join(', ')
                : artist.instruments.length > 0 ? 'N/A' : 'No instruments listed'
              : 'No instruments listed'}
            {artist.location && (
              <>
                <span style={{ color: '#ddd', margin: '0 4px' }}>•</span>
                {artist.location}
              </>
            )}
          </Typography>

          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            mb: 2
          }}>
            {Array.isArray(artist.genres) && artist.genres.filter(g => g?.name).slice(0, 3).map((genre, idx) => (
              <Chip
                key={genre.id || genre._id || idx}
                label={genre.name}
                size="small"
                variant="outlined"
                sx={{
                  borderRadius: '6px',
                  borderColor: theme.palette.divider,
                  bgcolor: theme.palette.action.hover,
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem'
                }}
              />
            ))}
            {Array.isArray(artist.genres) && artist.genres.filter(g => g?.name).length > 3 && (
              <Chip
                label={`+${artist.genres.filter(g => g?.name).length - 3}`}
                size="small"
                variant="outlined"
                sx={{
                  borderRadius: '6px',
                  borderColor: theme.palette.divider,
                  bgcolor: theme.palette.action.hover,
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </Box>

          <Typography variant="body2" sx={{
            color: theme.palette.text.secondary,
            fontSize: '0.9rem',
            lineHeight: 1.5,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexGrow: 1,
            minHeight: '72px'
          }}>
            {artist.description || "No description available"}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 'auto'
          }}>
            {!hidePrice && (
              <Typography sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                fontSize: '1rem'
              }}>
                {artist.pricing && artist.pricingUnit ? (
                  // `₹${artist.pricing}/${artist.pricingUnit}`
                  `₹${artist.pricing}/Session`
                ) : (
                  <span style={{ color: theme.palette.text.disabled, fontStyle: 'italic' }}>
                    Not listed
                  </span>
                )}
              </Typography>
            )}
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate(`/public-artist/${artist._id || artist.id}`)}
              sx={{
                borderRadius: '40px', // full semicircle on both sides
                textTransform: 'none',
                fontWeight: 500,
                px: 2.5,
                py: 0.7,
                bgcolor: '#6c2bd9',
                minWidth: '100px',
                fontSize: '0.85rem',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: '#5a24b8'
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
};

export default ArtistCard;