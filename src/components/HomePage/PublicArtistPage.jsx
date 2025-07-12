import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Star, StarHalf } from "lucide-react";
import "./css/PublicArtistPage.css";
import NavigationBar from "../NavigationBar";
import Footer from "./Footer";
import myImage from "../../public/defaultpic.png";
import myBg from "../../public/defaultbg.png";
import insta from "../../public/insta.jpeg";
import spotify from "../../public/spotify.png";
import apple from "../../public/apple.jpeg";
import SoundCloud from "../../public/soundcloud.jpeg";
import youtube from "../../public/youtube.png";
import ImageSlider from './ImageSlider';

const BookingFormPopup = ({ open, onClose, artist, onSubmit }) => {
  const [formData, setFormData] = useState({
    eventType: '',
    description: '',
    amount: '',
    crowdSize: '',
    crowdType: 'mixed',
    date: null,
    time: null,
    location: '',
    specialRequirements: ''
  });

  const eventTypes = [
    'wedding',
    'birthday',
    'corporate',
    'private',
    'festival',
    'other'
  ];

  const crowdSizes = [
    'small (1-50)',
    'medium (50-200)',
    'large (200-500)',
    'xlarge (500+)'
  ];

  const crowdTypes = [
    'mixed',
    'mostly male',
    'mostly female'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventDateTime = new Date(formData.date);
    if (formData.time) {
      eventDateTime.setHours(formData.time.getHours());
      eventDateTime.setMinutes(formData.time.getMinutes());
    }
    
    const bookingData = {
      ...formData,
      userId: localStorage.getItem('userId'),
      date: eventDateTime,
      artistId: artist._id,
      
      pricingUnit: artist.pricingUnit
    };
    if (bookingData.amount) {
  bookingData.amount = Number(bookingData.amount); // <-- Add this line
}
    
    onSubmit(bookingData);
  };

 return (
  <Dialog 
    open={open} 
    onClose={onClose} 
    maxWidth="sm" 
    fullWidth 
    sx={{
      '& .MuiPaper-root': {
        borderRadius: '12px',
        background: 'linear-gradient(145deg, #f8f9fa, #ffffff)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }
    }}
  >
    <DialogTitle sx={{
      background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
      color: 'white',
      padding: '20px 24px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    }}>
      <Typography variant="h5" component="div" sx={{ fontWeight: 700 }}>
        Book {artist?.stageName}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
        {artist?.pricing && `₹${artist.pricing} per ${artist.pricingUnit}`}
      </Typography>
    </DialogTitle>
    <form onSubmit={handleSubmit}>
      <DialogContent dividers sx={{ padding: '24px', backgroundColor: '#f8f9fa' }}>
        <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
          <InputLabel sx={{ color: '#495057', fontWeight: 500 }}>Event Type</InputLabel>
          <Select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            label="Event Type"
            required
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#dee2e6',
                borderRadius: '8px'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6a11cb'
              }
            }}
          >
            {eventTypes.map(type => (
              <MenuItem key={type} value={type} sx={{ color: '#495057' }}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          name="description"
          label="Event Description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={4}
          required
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#6a11cb'
              }
            }
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            mt: 2,
            mb: 3,
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': {
                  borderColor: '#6a11cb'
                }
              }
            }
          }}>
            <DatePicker
              label="Event Date"
              value={formData.date}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth required />}
              minDate={new Date()}
            />
            <TimePicker
              label="Start Time"
              value={formData.time}
              onChange={handleTimeChange}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Box>
        </LocalizationProvider>

        <TextField
          fullWidth
          margin="normal"
          name="location"
          label="Event Location"
          value={formData.location}
          onChange={handleChange}
          required
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#6a11cb'
              }
            }
          }}
        />

        <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
          <InputLabel sx={{ color: '#495057', fontWeight: 500 }}>Expected Crowd Size</InputLabel>
          <Select
            name="crowdSize"
            value={formData.crowdSize}
            onChange={handleChange}
            label="Expected Crowd Size"
            required
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#dee2e6',
                borderRadius: '8px'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6a11cb'
              }
            }}
          >
            {crowdSizes.map(size => (
              <MenuItem key={size} value={size} sx={{ color: '#495057' }}>{size}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
          <InputLabel sx={{ color: '#495057', fontWeight: 500 }}>Crowd Type</InputLabel>
          <Select
            name="crowdType"
            value={formData.crowdType}
            onChange={handleChange}
            label="Crowd Type"
            required
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#dee2e6',
                borderRadius: '8px'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#6a11cb'
              }
            }}
          >
            {crowdTypes.map(type => (
              <MenuItem key={type} value={type} sx={{ color: '#495057' }}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          name="amount"
          label="Your amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          InputProps={{
            startAdornment: <Typography sx={{ color: '#495057', mr: 1 }}>₹ </Typography>,
          }}
          required
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#6a11cb'
              }
            }
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          name="specialRequirements"
          label="Special Requirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          multiline
          rows={2}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '&:hover fieldset': {
                borderColor: '#6a11cb'
              }
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ 
        padding: '16px 24px', 
        backgroundColor: '#f8f9fa',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
      }}>
        <Button 
          onClick={onClose} 
          sx={{
            color: '#6c757d',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: 'rgba(108,117,125,0.1)'
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          sx={{
            background: 'linear-gradient(45deg, #6a11cb 0%, #2575fc 100%)',
            borderRadius: '8px',
            padding: '8px 24px',
            fontWeight: 600,
            boxShadow: '0 4px 14px rgba(106,17,203,0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a0cb1 0%, #1a65e8 100%)',
              boxShadow: '0 6px 20px rgba(106,17,203,0.4)'
            }
          }}
        >
          Submit Request
        </Button>
      </DialogActions>
    </form>
  </Dialog>
);
};

export default function PublicArtistPage() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    limit: 5
  });

  const handleBookNow = () => {
    const isLoggedIn = localStorage.getItem('token');
    if (!isLoggedIn) {
      navigate('/signup');
    } else {
      setBookingOpen(true);
    }
  };
  

  const handleBookingSubmit = async (bookingData) => {
    try {
      console.log(bookingData);
      const token = localStorage.getItem('token');
      // console.log(token);
      const response = await fetch('https://backend-musical.onrender.com/api/events/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Booking request submitted successfully!',
          severity: 'success'
        });
        setBookingOpen(false);
      } else {
        setSnackbar({
          open: true,
          message: result.message || 'Failed to submit booking request',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'An error occurred while submitting your request',
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
      const fetchArtist = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`https://backend-musical.onrender.com/api/artists/${_id}`);
          const result = await response.json();
          if (response.ok && result) {
            setArtist(result);
            // Fetch reviews after artist data is loaded
            fetchArtistReviews(result._id);
          } else {
            setError(result.message || "Artist not found");
          }
        } catch (err) {
          setError("Artist not found");
        }
        setLoading(false);
      };

      const fetchArtistReviews = async (artistId) => {
        setReviewsLoading(true);
        try {
          const response = await fetch(
            `https://backend-musical.onrender.com/api/ratings/artist/${artistId}/reviews?page=${pagination.currentPage}&limit=${pagination.limit}`
          );
          const result = await response.json();
          if (response.ok) {
            setReviews(result.data || []);
            setPagination(prev => ({
              ...prev,
              totalPages: result.pagination?.totalPages || 0
            }));
          } else {
            setReviewsError(result.message || "Failed to load reviews");
          }
        } catch (err) {
          setReviewsError("Failed to load reviews");
        }
        setReviewsLoading(false);
      };

      fetchArtist();
    }, [_id, pagination.currentPage, pagination.limit]);


  const handlePageChange = (newPage) => {
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }));
  };
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
    return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };

  // Create galleryMedia array from artist's galleryImages and videos
  const galleryImages = Array.isArray(artist?.galleryImages)
    ? artist.galleryImages.filter(img => !!img).map(img => ({ type: 'image', src: getImageSrc(img) }))
    : [];
  // Videos are stored in artist.videos as Google Drive links
  const getVideoSrc = (url) => {
    if (!url) return null;
    let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
    if (!match) {
      match = url.match(/[?&]id=([\w-]+)/);
    }
    let directUrl = url;
    if (match && match[1]) {
      directUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return `https://backend-musical.onrender.com/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };
  const galleryVideos = Array.isArray(artist?.videos)
    ? artist.videos.filter(v => !!v).map(videoUrl => ({ type: 'video', src: getVideoSrc(videoUrl) }))
    : [];
  const galleryMedia = [...galleryImages, ...galleryVideos];

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.3;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="artist-profile-star" size={18} />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="artist-profile-star" size={18} />);
    }
    return stars;
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!artist) return <Alert severity="error">Artist not found</Alert>;

  return (
  <>
    <NavigationBar />
    <Box className="public-artist-bg">
      {/* Banner Image */}
      <Box className="public-artist-banner">
        <img
          src={getImageSrc(artist.coverImage) || myBg}
          alt={artist.stageName}
          className="public-artist-banner-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = myBg;
          }}
        />
      </Box>

      {/* Main Content Row: Profile Info Card + Other Artists */}
      <Box className="public-artist-main-row">
        <Box
          className="public-artist-info-card"
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Stack on small screens, row on medium and up
            alignItems: { xs: 'center', md: 'flex-start' }, // Center items on small, flex-start on medium and up
            justifyContent: 'flex-start',
            padding: { xs: '1rem', md: '2rem' }, // Adjust padding for smaller screens
            gap: { xs: '1rem', md: 'unset' }, // Add gap when stacked
          }}
        >
          {/* Profile Pic + Rating (left) */}
          <Box
            className="public-artist-pic"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 200,
              marginBottom: { xs: '1rem', md: 'unset' }, // Add margin bottom when stacked
            }}
          >
            <img
              src={getImageSrc(artist.imageUrl) || myImage}
              alt={artist.stageName}
              className="public-artist-pic-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = myImage;
              }}
            />
            <div className="public-artist-rating-row" style={{ marginTop: '1rem' }}>
              {renderStars(Number(artist.rating))}
              <span className="public-artist-rating">{artist.rating}</span>
            </div>
          </Box>
          {/* Name (center, shifted right/up) and Price below */}
          <br/>
          <br/>
          <br/>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: { xs: 'center', md: 'flex-start' }, // Center on small, flex-start on medium and up
              position: 'relative',
              left: { xs: 0, md: 260 }, // Remove left shift on small screens
              top: { xs: 0, md: -10 }, // Remove top shift on small screens
              textAlign: { xs: 'center', md: 'left' }, // Center text on small screens
            }}
          >
            <div className="public-artist-name">{artist.stageName}</div>
            <div
              style={{
                fontFamily: 'Montserrat, Inter, Arial, sans-serif',
                fontWeight: 600,
                color: '#6c2bd9',
                fontSize: '1.1rem',
                marginTop: 4,
              }}
            >
              {artist.pricing && artist.pricingUnit ? (
                `₹${artist.pricing} / Session`
              ) : (
                <span style={{ color: '#888', fontStyle: 'italic' }}>Not listed</span>
              )}
            </div>
          </Box>
          {/* Book Now button (right, absolute) */}
          <button
            className="public-artist-book-btn"
            style={{
              position: { xs: 'static', md: 'absolute' }, // Static on small, absolute on medium and up
              top: { xs: 'unset', md: '2rem' },
              right: { xs: 'unset', md: '2rem' },
              zIndex: 2,
              marginTop: { xs: '1rem', md: 'unset' }, // Add margin top when static
              width: { xs: '100%', md: 'auto' }, // Full width on small screens
            }}
            onClick={handleBookNow}
          >
            Book Now
          </button>
          {/* Social Media Links below Book Now */}
          {artist.socialMediaLinks && artist.socialMediaLinks.length > 0 && (
            <div
              style={{
                position: { xs: 'static', md: 'absolute' }, // Static on small, absolute on medium and up
                top: { xs: 'unset', md: '5.5rem' },
                right: { xs: 'unset', md: '2rem' },
                zIndex: 1,
                display: 'flex',
                flexDirection: 'row',
                gap: 18,
                justifyContent: { xs: 'center', md: 'flex-end' }, // Center on small, flex-end on medium and up
                marginTop: { xs: '1rem', md: 'unset' }, // Add margin top when static
                width: { xs: '100%', md: 'auto' }, // Full width on small screens
                flexWrap: 'wrap', // Allow items to wrap
              }}
            >
              {artist.socialMediaLinks.map((link, idx) => {
                const platformIcons = {
                  Instagram: insta,
                  Spotify: spotify,
                  'Apple Music': apple,
                  SoundCloud: SoundCloud,
                  YouTube: youtube,
                };
                const iconSrc = platformIcons[link.platform]; // No fallback to linkIcon
                return (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 2px 8px #e0e0e0',
                      padding: 6,
                      border: '2px solid #eee',
                      transition: 'box-shadow 0.2s, border 0.2s',
                      margin: 0,
                    }}
                    title={link.platform}
                  >
                    {iconSrc && (
                      <img
                        src={iconSrc}
                        alt={link.platform}
                        style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: '50%' }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </Box>
      </Box>

      {/* Tabs */}
     {/* Tabs */}
<Box
  className="public-artist-tabs-row"
  sx={{
    flexDirection: { xs: 'column', sm: 'row' }, // Stack tabs on extra small, row on small and up
    padding: { xs: '0 1rem', md: '0 2rem' }, // Adjust padding
    gap: { xs: '0.5rem', sm: 'unset' }, // Add gap when stacked
  }}
>
  {['About', 'Instruments', 'Reviews'].map((tab, idx) => (
    <Box
      key={tab}
      className={`public-artist-tab${selectedTab === idx ? ' selected' : ''}`}
      onClick={() => setSelectedTab(idx)}
      sx={{
        width: { xs: '100%', sm: 'auto' }, // Full width on extra small, auto on small and up
      }}
    >
      <span className={`public-artist-tab-label${selectedTab === idx ? '' : ' unselected'}`}>
        {tab}
      </span>
    </Box>
  ))}
</Box>

{/* Tab Content */}
<Box className="public-artist-tab-content" sx={{ padding: { xs: '1rem', md: '2rem' } }}>
  {selectedTab === 0 && (
    <div className="public-artist-tab-body">
      {artist.description || 'No description available.'}
    </div>
  )}
  {selectedTab === 1 && (
    <div className="public-artist-tab-body">
      {artist.instruments?.map((i) => i.name).join(', ') || 'No instruments listed.'}
    </div>
  )}
  {/* {selectedTab === 2 && (
    <div className="public-artist-tab-body">
      {artist.pricing && artist.pricingUnit
        ? `Booking Price: ₹${artist.pricing} per ${artist.pricingUnit}`
        : 'No booking options listed.'}
      <br />
      {artist.email && <span>Email: {artist.email}</span>}
      <br />
      {artist.phone && <span>Phone: {artist.phone}</span>}
    </div>
  )} */}
  {selectedTab === 2 && (
    <div className="public-artist-tab-body">
      {reviewsLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : reviewsError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {reviewsError}
        </Alert>
      ) : reviews.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No reviews yet. Be the first to review this artist!
        </Typography>
      ) : (
        <>
          <Box className="reviews-container">
            {reviews.map((review, index) => (
              <Box 
                key={index} 
                className="review-card"
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: '8px',
                  backgroundColor: 'background.paper',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box display="flex" alignItems="center" mb={1}>
                  {renderStars(review.rating)}
                  <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 600 }}>
                    {review.rating.toFixed(1)}/5
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {review.review}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </Typography>
              </Box>
            ))}
          </Box>

          {pagination.totalPages > 1 && (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center"
              mt={3}
              sx={{
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 2 }
              }}
            >
              <Button
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: '100px',
                  order: { xs: 1, sm: 0 }
                }}
              >
                Previous
              </Button>
              <Typography 
                variant="body2" 
                sx={{ 
                  mx: { sm: 2 },
                  textAlign: 'center',
                  order: { xs: 0, sm: 1 }
                }}
              >
                Page {pagination.currentPage} of {pagination.totalPages}
              </Typography>
              <Button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                variant="outlined"
                size="small"
                sx={{
                  minWidth: '100px',
                  order: { xs: 2, sm: 2 }
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  )}
</Box>

      {/* Booking Form Popup */}
      <BookingFormPopup
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        artist={artist}
        onSubmit={handleBookingSubmit}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: snackbar.severity === 'success' ? '#4caf50' : '#f44336',
          },
        }}
      />
      {/* Image Slider Section */}
      <div className="image-slider-section" style={{ padding: { xs: '1rem', md: '2rem' } }}>
        <h2
          className="slider-heading"
          style={{
            fontWeight: 700,
            marginBottom: '1.5rem',
            fontSize: '2.8rem',
            textAlign: 'center',
            letterSpacing: '1px',
          }}
        >
          Gallery
        </h2>
        <ImageSlider media={galleryMedia} />
      </div>

      <Footer />
    </Box>
  </>
);
}