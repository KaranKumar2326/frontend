import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  ArrowLeft,
  Ticket,
  Mic2,
  User,
  Music,
  Share2,
  Heart,
  CheckCircle,
  Headphones
} from "lucide-react";

const EventPage = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Set axios base URL (should match your JammingPage)
  axios.defaults.baseURL = 'http://localhost:3001';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch event details from your API
        const response = await axios.get(`/api/jamming-sessions/${eventId}`);
        setEvent(response.data);
        
        // You can also check if user has liked or registered for this event
        // const userStatusResponse = await axios.get(`/api/jamming-sessions/${eventId}/user-status`);
        // setIsLiked(userStatusResponse.data.isLiked);
        // setIsRegistered(userStatusResponse.data.isRegistered);
        
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

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

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // In a real app, you'd show a toast notification instead of alert
    alert('Event link copied to clipboard!');
  };

  const handleRegister = async () => {
    try {
      if (!isRegistered) {
        // Register for the event
        await axios.post(`/api/jamming-sessions/${eventId}/register`);
        setIsRegistered(true);
        // Update the event capacity if needed
        setEvent(prev => ({
          ...prev,
          currentCapacity: (prev.currentCapacity || 0) + 1
        }));
      } else {
        // Unregister from the event
        await axios.delete(`/api/jamming-sessions/${eventId}/register`);
        setIsRegistered(false);
        setEvent(prev => ({
          ...prev,
          currentCapacity: Math.max((prev.currentCapacity || 1) - 1, 0)
        }));
      }
    } catch (err) {
      console.error('Error updating registration:', err);
      alert('Failed to update registration. Please try again.');
    }
  };

  const handleLike = async () => {
    try {
      if (!isLiked) {
        await axios.post(`/api/jamming-sessions/${eventId}/like`);
        setIsLiked(true);
      } else {
        await axios.delete(`/api/jamming-sessions/${eventId}/like`);
        setIsLiked(false);
      }
    } catch (err) {
      console.error('Error updating like status:', err);
    }
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
          <p className="text-purple-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleBackClick}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Event not found</h2>
          <button 
            onClick={handleBackClick}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Header with Back Button */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            
            {/* Hero Section */}
            {/* add background image */}
            
            <div 
  className={`bg-gradient-to-r ${getGenreGradient(event.genre)} rounded-xl p-6 md:p-8 text-white relative overflow-hidden`}
  style={{
    backgroundImage: event.coverImage ? `url(${event.coverImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <Headphones className="w-3.5 h-3.5 mr-1.5" />
                    {event.genre}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleLike}
                      className={`p-2.5 rounded-full transition-all duration-200 ${
                        isLiked ? 'bg-red-500 text-white scale-110' : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                      onClick={handleShare}
                      className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105 transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
            onClick={handleBackClick}
            className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </button>
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">{event.title}</h1>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-white/90">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {formatTime(event.startTime, event.endTime)}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Session</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                {event.description || "Join us for an amazing jamming session! Bring your instruments and let's make some music together."}
              </p>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60">
              <h2 className="text-xl font-semibold text-gray-900 mb-5">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3 mt-0.5">
                      <Calendar className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Date</p>
                      <p className="text-gray-600 text-sm">{formatDate(event.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3 mt-0.5">
                      <Clock className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Time</p>
                      <p className="text-gray-600 text-sm">{formatTime(event.startTime, event.endTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3 mt-0.5">
                      <Users className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Capacity</p>
                      <p className="text-gray-600 text-sm">{event.currentCapacity || 0}/{event.maxCapacity}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3 mt-0.5">
                      <MapPin className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Location</p>
                      <p className="text-gray-600 text-sm">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3 mt-0.5">
                      <Music className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Genre</p>
                      <p className="text-gray-600 text-sm">{event.genre}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-2 bg-violet-100 rounded-lg mr-3 mt-0.5">
                      <DollarSign className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Price</p>
                      <p className="text-gray-600 text-sm">
                        {event.isPaid ? `$${event.price}` : 'Free'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Registration Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60 sticky top-20">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-violet-600 mb-2">
                  {event.isPaid ? `$${event.price}` : 'Free'}
                </div>
                <p className="text-gray-500 text-sm">
                  {(event.maxCapacity - (event.currentCapacity || 0))} spots remaining
                </p>
              </div>
              
              <button
                onClick={handleRegister}
                disabled={!event.isPaid && (event.currentCapacity || 0) >= event.maxCapacity}
                className={`w-full py-3 px-6 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isRegistered
                    ? 'bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100'
                    : (event.currentCapacity || 0) >= event.maxCapacity
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-violet-600 text-white hover:bg-violet-700 shadow-md hover:shadow-lg hover:scale-[1.02]'
                }`}
              >
                {isRegistered ? (
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Registered
                  </div>
                ) : (event.currentCapacity || 0) >= event.maxCapacity ? (
                  'Event Full'
                ) : (
                  <div className="flex items-center justify-center">
                    <Ticket className="w-4 h-4 mr-2" />
                    {event.isPaid ? 'Buy Ticket' : 'Join Session'}
                  </div>
                )}
              </button>
              
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Attendees</span>
                  <span className="font-medium">{event.currentCapacity || 0}/{event.maxCapacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${Math.min(((event.currentCapacity || 0) / event.maxCapacity) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            {event.organizer && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/60">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Organizer</h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center mr-4">
                    <User className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{event.organizer}</p>
                    <p className="text-xs text-gray-500">Event Organizer</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPage;