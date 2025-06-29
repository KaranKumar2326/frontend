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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth className="booking-form">
      <DialogTitle>
        <Typography variant="h5" component="div">
          Book {artist?.stageName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {artist?.pricing && `$${artist.pricing} per ${artist.pricingUnit}`}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <FormControl fullWidth margin="normal">
            <InputLabel>Event Type</InputLabel>
            <Select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              label="Event Type"
              required
            >
              {eventTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
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
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
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
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Expected Crowd Size</InputLabel>
            <Select
              name="crowdSize"
              value={formData.crowdSize}
              onChange={handleChange}
              label="Expected Crowd Size"
              required
            >
              {crowdSizes.map(size => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Crowd Type</InputLabel>
            <Select
              name="crowdType"
              value={formData.crowdType}
              onChange={handleChange}
              label="Crowd Type"
              required
            >
              {crowdTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
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
              startAdornment: <Typography>$</Typography>,
            }}
            required
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
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
      const response = await fetch('http://localhost:3001/api/events/request', {
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
        const response = await fetch(`http://localhost:3001/api/artists/${_id}`);
        const result = await response.json();
        if (response.ok && result) {
          setArtist(result);
        } else {
          setError(result.message || "Artist not found");
        }
      } catch (err) {
        setError("Artist not found");
      }
      setLoading(false);
    };
    fetchArtist();
  }, [_id]);

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
    return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
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
    return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
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
            onError={e => { e.target.onerror = null; e.target.src =myBg; }}
          />
        </Box>

        {/* Main Content Row: Profile Info Card + Other Artists */}
        <Box className="public-artist-main-row">
          <Box className="public-artist-info-card" style={{ position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            {/* Profile Pic + Rating (left) */}
            <Box className="public-artist-pic" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 200 }}>
              <img
                src={getImageSrc(artist.imageUrl) || myImage}
                alt={artist.stageName}
                className="public-artist-pic-img"
                onError={e => { e.target.onerror = null; e.target.src = myImage; }}
              />
              <div className="public-artist-rating-row" style={{ marginTop: '1rem' }}>
                {renderStars(Number(artist.rating))}
                <span className="public-artist-rating">{artist.rating}</span>
              </div>
            </Box>
            {/* Name (center, shifted right/up) and Price below */}
            <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', position: 'relative', left: 260, top: -10 }}>
              <div className="public-artist-name">{artist.stageName}</div>
              <div style={{ fontFamily: 'Montserrat, Inter, Arial, sans-serif', fontWeight: 600, color: '#6c2bd9', fontSize: '1.1rem', marginTop: 4 }}>
                {artist.pricing && artist.pricingUnit ? (
                  `$${artist.pricing} / ${artist.pricingUnit}`
                ) : (
                  <span style={{ color: '#888', fontStyle: 'italic' }}>Not listed</span>
                )}
              </div>
            </Box>
            {/* Book Now button (right, absolute) */}
            <button 
              className="public-artist-book-btn" 
              style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 2 }}
              onClick={handleBookNow}
            >
              Book Now
            </button>
            {/* Social Media Links below Book Now */}
            {artist.socialMediaLinks && artist.socialMediaLinks.length > 0 && (
              <div style={{ position: 'absolute', top: '5.5rem', right: '2rem', zIndex: 1, display: 'flex', flexDirection: 'row', gap: 18, justifyContent: 'flex-end' }}>
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
                        margin: 0
                      }}
                      title={link.platform}
                    >
                      {iconSrc && <img src={iconSrc} alt={link.platform} style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: '50%' }} />}
                    </a>
                  );
                })}
              </div>
            )}
          </Box>
        </Box>

        {/* Tabs */}
        <Box className="public-artist-tabs-row">
          {['About', 'Instruments', 'Booking Options'].map((tab, idx) => (
            <Box
              key={tab}
              className={`public-artist-tab${selectedTab === idx ? ' selected' : ''}`}
              onClick={() => setSelectedTab(idx)}
            >
              <span className={`public-artist-tab-label${selectedTab === idx ? '' : ' unselected'}`}>{tab}</span>
            </Box>
          ))}
        </Box>

        {/* Tab Content */}
        <Box className="public-artist-tab-content">
          {selectedTab === 0 && (
            <div className="public-artist-tab-body">{artist.description || 'No description available.'}</div>
          )}
          {selectedTab === 1 && (
            <div className="public-artist-tab-body">{artist.instruments?.map(i => i.name).join(', ') || 'No instruments listed.'}</div>
          )}
          {selectedTab === 2 && (
            <div className="public-artist-tab-body">
              {artist.pricing && artist.pricingUnit
                ? `Booking Price: $${artist.pricing} per ${artist.pricingUnit}`
                : 'No booking options listed.'}
              <br />
              {artist.email && <span>Email: {artist.email}</span>}
              <br />
              {artist.phone && <span>Phone: {artist.phone}</span>}
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
              backgroundColor: snackbar.severity === 'success' ? '#4caf50' : '#f44336'
            }
          }}
        />
        {/* Image Slider Section */}
        <div className="image-slider-section">
          <h2 className="slider-heading" style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '2.8rem', textAlign: 'center', letterSpacing: '1px' }}>Gallery</h2>
          <ImageSlider media={galleryMedia} />
        </div>

        <Footer />
      </Box>
    </>
  );
}