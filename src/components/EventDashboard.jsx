import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  Music,
  TrendingUp,
  Eye,
  Check,
  X,
  Search,
  Star,
  Headphones,
  Mail,
  Phone,
  MessageSquare
} from "lucide-react";
import axios from 'axios';
import NavigationBar from './NavigationBar';
import Footer from './HomePage/Footer';

const ArtistRequests = () => {
  const user = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    thisMonthEarnings: 0,
    averageRating: 4.5
  });
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`https://backend-musical.onrender.com/api/events/artist/${user}`);
        setRequests(response.data);

        // Calculate stats
        const total = response.data.length;
        const pending = response.data.filter(r => r.status === 'pending').length;
        const accepted = response.data.filter(r => r.status === 'accepted').length;
        const earnings = response.data
          .filter(r => r.status === 'accepted' || r.status === 'completed')
          .reduce((sum, r) => sum + r.amount, 0);

        setStats({
          totalRequests: total,
          pendingRequests: pending,
          acceptedRequests: accepted,
          thisMonthEarnings: earnings,
          averageRating: 4.5
        });
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleRequestAction = async (eventId, action) => {
    try {
      const response = await axios.put(`https://backend-musical.onrender.com/api/events/${eventId}`, { 
        status: action 
      });
      console.log(response);

      setRequests(prev => prev.map(req => 
        req._id === eventId 
          ? { ...req, status: action }
          : req
      ));
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleRateUser = (event) => {
    setSelectedEvent(event);
    setShowRatingForm(true);
    setRating(0);
  };

  const submitRating = async () => {
    if (!rating || rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3001/api/ratings/user', {
        userId: selectedEvent.user._id,
        rating
      });

      // Close the form and reset state
      setShowRatingForm(false);
      setSelectedEvent(null);
      setRating(0);
      
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = request.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });
return (
  <>
    <NavigationBar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Artist Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your bookings and track your performance</p>
            </div>
            <div className="flex items-center justify-center sm:justify-end">
              <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-3 rounded-xl">
                <Music className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Form Modal */}
      {showRatingForm && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rate {selectedEvent.user?.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                How was your experience working with {selectedEvent.user?.name} for the {selectedEvent.eventType} event?
              </p>
              
              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex items-center space-x-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() => setRating(star)}
                                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                                        rating >= star 
                                          ? 'bg-yellow-400 text-white hover:bg-yellow-500' 
                                          : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'
                                      }`}
                                    >
                                      <Star className="w-5 h-5" fill={rating >= star ? 'currentColor' : 'none'} />
                                    </button>
                                  ))}
                                </div>
                              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRatingForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submitRating}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Requests Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Performance Requests</h2>
                <p className="text-gray-600 text-sm mt-1">Manage your booking requests and client communications</p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-auto sm:max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 hover:border-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="overflow-x-auto">
  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit min-w-full sm:min-w-0">
    {[
      { key: 'all', label: 'All', fullLabel: 'All Requests', count: requests.length },
      { key: 'pending', label: 'Pending', fullLabel: 'Pending', count: requests.filter(r => r.status === 'pending').length },
      { key: 'accepted', label: 'Accepted', fullLabel: 'Accepted', count: requests.filter(r => r.status === 'accepted').length },
      { key: 'completed', label: 'Completed', fullLabel: 'Completed', count: requests.filter(r => r.status === 'completed').length },
      { key: 'cancelled', label: 'Cancelled', fullLabel: 'Cancelled', count: requests.filter(r => r.status === 'cancelled' || r.status === 'rejected').length }
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap 
          ${activeTab === tab.key ? 'bg-white text-indigo-600 shadow-sm font-semibold' : 'bg-transparent text-gray-600'}
          hover:bg-transparent hover:text-gray-600 focus:outline-none`} // Added `hover:bg-transparent` to disable color change on hover
      >
        <span className="sm:hidden">{tab.label}</span>
        <span className="hidden sm:inline">{tab.fullLabel}</span>
        <span className="text-gray-500 font-normal ml-1">({tab.count})</span>
      </button>
    ))}
  </div>
</div>

          </div>

          {/* Requests List */}
          <div className="divide-y divide-gray-100">
            {filteredRequests.map((request) => (
              <div key={request._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col space-y-4">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{request.eventType}</h3>
                      <p className="text-violet-600 font-medium text-sm">{request.user?.name || 'No user name'}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  {/* Event Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
                      <span className="truncate">{formatDate(request.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
                      <span className="truncate">{request.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
                      <span>₹{request.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
                      <span className="truncate">{request.crowdSize}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Headphones className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
                      <span className="truncate">{request.crowdType}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <strong className="text-gray-900">Description:</strong> {request.description}
                    </div>
                    {request.artistNotes && (
                      <div className="text-sm text-gray-700 mt-2 bg-blue-50 p-3 rounded-lg">
                        <strong className="text-gray-900">Your Notes:</strong> {request.artistNotes}
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{request.user?.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span>{request.user?.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">Requested on {formatDate(request.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleRequestAction(request._id, 'accepted')}
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(request._id, 'rejected')}
                          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Decline
                        </button>
                      </>
                    )}
                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleRequestAction(request._id, 'completed')}
                        className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                      >
                        Mark as Completed
                      </button>
                    )}
                    {request.status === 'completed' && (
                      <button
                        onClick={() => handleRateUser(request)}
                        className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium"
                      >
                        <Star className="w-4 h-4 mr-1" />
                        Rate Client
                      </button>
                    )}
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredRequests.length === 0 && (
              <div className="p-8 sm:p-12 text-center">
                <Music className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No requests found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);
};

export default ArtistRequests;