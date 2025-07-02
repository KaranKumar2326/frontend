import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const BookingFormPopup = ({ open, onClose, artist, onSubmit }) => {
  const [formData, setFormData] = useState({
    eventType: '',
    description: '',
    budget: artist?.pricing || '',
    crowdSize: '',
    crowdType: 'mixed',
    date: null,
    time: null,
    location: '',
    specialRequirements: ''
  });

  const eventTypes = [
    'Wedding',
    'Birthday Party',
    'Corporate Event',
    'Private Party',
    'Festival',
    'Other'
  ];

  const crowdSizes = [
    'Small (1-50)',
    'Medium (50-200)',
    'Large (200-500)',
    'X-Large (500+)'
  ];

  const crowdTypes = [
    'Mixed',
    'Mostly Male',
    'Mostly Female'
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
      date: eventDateTime,
      artistId: artist._id,
      price: artist.pricing,
      pricingUnit: artist.pricingUnit
    };
    
    onSubmit(bookingData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div">
          Book {artist?.stageName}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {artist?.pricing && `₹${artist.pricing} per ${artist.pricingUnit}`}
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
            name="budget"
            label="Your Budget"
            type="number"
            value={formData.budget}
            onChange={handleChange}
            InputProps={{
              startAdornment: <Typography>₹</Typography>,
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

export default BookingFormPopup;