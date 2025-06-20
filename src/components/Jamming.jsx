import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Headphones, DollarSign, Search, Users, X, Clock, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './NavigationBar';
import Footer from './HomePage/Footer';
// import { useAuth } from '../context/AuthContext'; // Assuming you have an auth context

const JammingPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    genre: '',
    paid: null,
    date: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    genre: 'Rock',
    maxCapacity: '',
    isPaid: false,
    price: '0',
    coverImage: ''
  });
  const [errors, setErrors] = useState({});
  // const { user } = useAuth(); // Get current user from auth context

  const navigate = useNavigate();
  axios.defaults.baseURL = 'https://backend-musical.onrender.com';

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.date) params.append('date', filters.date);
      if (filters.paid !== null) params.append('isPaid', filters.paid);
      
      const response = await axios.get(`/api/jamming-sessions?${params.toString()}`);
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setLoading(false);
    }
  };
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get the role from localStorage
    const userRole = localStorage.getItem('role');
    setRole(userRole);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value === '' ? null : value,
    }));
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleCreateClick = () => {
    // if (!user) {
    //   navigate('/login');
    //   return;
    // }
    setShowCreateForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.maxCapacity || formData.maxCapacity < 1) 
      newErrors.maxCapacity = 'Capacity must be at least 1';
    if (formData.isPaid && (!formData.price || formData.price < 0))
      newErrors.price = 'Price must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const payload = {
        ...formData,
        maxCapacity: parseInt(formData.maxCapacity),
        price: formData.isPaid ? parseFloat(formData.price) : 0
      };

      const response = await axios.post('/api/jamming-sessions', payload, config);
      setEvents([...events, response.data]);
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        genre: 'Rock',
        maxCapacity: '',
        isPaid: false,
        price: '0',
        coverImage: ''
      });
    } catch (err) {
      console.error('Error creating session:', err.response?.data || err.message);
      alert('Failed to create session. Please try again.');
    }
  };

  const getGenreGradient = (genre) => {
    const gradients = {
      'Rock': 'from-purple-600 to-purple-800',
      'Jazz': 'from-purple-500 to-indigo-600',
      'Hip-Hop': 'from-violet-600 to-purple-700',
      'Pop': 'from-purple-400 to-pink-500',
      'Acoustic': 'from-indigo-500 to-purple-600',
      'Indie': 'from-purple-500 to-violet-600',
      'Other': 'from-purple-600 to-violet-700'
    };
    return gradients[genre] || 'from-purple-600 to-violet-700';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (startTime, endTime) => {
    const formatTimeString = (timeString) => {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    return `${formatTimeString(startTime)} - ${formatTimeString(endTime)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading jam sessions...</p>
        </div>
      </div>
    );
  }

  const filteredEvents = events.filter((event) => {
    const locationMatch = filters.location
      ? event.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    const genreMatch = filters.genre
      ? event.genre.toLowerCase().includes(filters.genre.toLowerCase())
      : true;

    const dateMatch = filters.date ? event.date === filters.date : true;

    const paidMatch = filters.paid !== null
      ? event.isPaid === (filters.paid === "true")
      : true;

    return locationMatch && genreMatch && dateMatch && paidMatch;
  });
  return (
    <>
    <NavigationBar />
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
      {/* Header with Create Button */}
      <div className="pt-12 pb-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
              Discover Music Jams
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find and join amazing music jam sessions in your area
            </p>
            {role === 'artist' && (
        <button
          onClick={handleCreateClick}
          className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl transition-colors duration-200"
        >
          Create New Jam Session
        </button>
      )}
          </div>
        </div>
      </div>

      {/* Create Session Modal */}
     {/* Create Session Modal */}
{showCreateForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create Jam Session</h2>
          <button 
            onClick={() => setShowCreateForm(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Session title"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your session"
              rows="2"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre*</label>
              <div className="relative">
                <Headphones className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleFormChange}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Rock">Rock</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Hip-Hop">Hip-Hop</option>
                  <option value="Pop">Pop</option>
                  <option value="Acoustic">Acoustic</option>
                  <option value="Indie">Indie</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
              <div className="relative">
                <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleFormChange}
                  className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
              <div className="relative">
                <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleFormChange}
                  className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.endTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
            <div className="relative">
              <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Venue or address"
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>

          {/* Capacity and Pricing Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Capacity*</label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleFormChange}
                min="1"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.maxCapacity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="# of people"
              />
              {errors.maxCapacity && <p className="text-red-500 text-xs mt-1">{errors.maxCapacity}</p>}
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  name="isPaid"
                  checked={formData.isPaid}
                  onChange={handleFormChange}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-700">Paid Event</span>
              </label>
              {formData.isPaid && (
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Price"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleFormChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
      {/* Filter Section */}
            <div className="container mx-auto mb-12 px-6">
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="text-purple-600" size={24} />
                  <h2 className="text-2xl font-semibold text-gray-800">Find Your Perfect Jam</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="location"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      placeholder="Search location..."
                    />
                  </div>
                  
                  <div className="relative">
                    <Headphones className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      name="genre"
                      value={filters.genre}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">All Genres</option>
                      <option value="Rock">Rock</option>
                      <option value="Jazz">Jazz</option>
                      <option value="Hip-Hop">Hip-Hop</option>
                      <option value="Pop">Pop</option>
                      <option value="Acoustic">Acoustic</option>
                      <option value="Indie">Indie</option>
                    </select>
                  </div>
                  
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      name="date"
                      value={filters.date}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      name="paid"
                      value={filters.paid || ''}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="">All Events</option>
                      <option value="true">Paid Events</option>
                      <option value="false">Free Events</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <br></br>
            <br></br>
      
            {/* Event Cards */}
            <div className="container mx-auto px-6 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-200 cursor-pointer transition-all duration-300 overflow-hidden"
                    onClick={() => handleEventClick(event._id)}
                  >
                    {/* Card Header */}
                    <div className={`h-2 bg-gradient-to-r ${getGenreGradient(event.genre)}`}></div>
                    
                    <div className="p-6">
                      {/* Title and Genre */}
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                          {event.title}
                        </h3>
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          {event.genre}
                        </span>
                      </div>
                      
                      {/* Event Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar size={16} className="text-purple-500" />
                          <div>
                            <div className="font-medium text-gray-800">{event.date}</div>
                            <div className="text-sm text-gray-500">{event.time}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin size={16} className="text-purple-500" />
                          <span className="text-gray-800">{event.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <Users size={16} className="text-purple-500" />
                          <span className="text-gray-800">{event.capacity} attendees</span>
                        </div>
                      </div>
                      
                      {/* Price and Action */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div className={`px-4 py-2 rounded-lg font-semibold ${
                          event.isPaid 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {event.isPaid ? event.price : "FREE"}
                        </div>
                        
                        <button className="text-black hover:text-black font-medium group-hover:translate-x-1 transition-all duration-200">
                          Join Event →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* No Results */}
              {filteredEvents.length === 0 && (
                <div className="text-center py-16">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-purple-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
                    <p className="text-gray-600">Try adjusting your filters to discover more jam sessions!</p>
                  </div>
                </div>
              )}
            </div>

            <br></br>
            <br></br>

      {/* Rest of your existing JammingPage content (Filter Section and Event Cards) */}
      {/* ... */}
    </div>
    <Footer />
    </>
  );
};

export default JammingPage;