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
import Footer from './HomePage/Footer';

const UserRequests = () => {
  const user = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    totalSpent: 0
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`https://backend-musical.onrender.com/api/events/user/${user}`);
        setRequests(response.data);

        // Calculate stats
        const total = response.data.length;
        const pending = response.data.filter(r => r.status === 'pending').length;
        const accepted = response.data.filter(r => r.status === 'accepted').length;
        const totalSpent = response.data
          .filter(r => r.status === 'accepted' || r.status === 'completed')
          .reduce((sum, r) => sum + r.amount, 0);

        setStats({
          totalRequests: total,
          pendingRequests: pending,
          acceptedRequests: accepted,
          totalSpent: totalSpent
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

  const filteredRequests = requests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = request.artist?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

 return (
  <>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-display">My Booking Requests</h1>
              <p className="text-gray-500 text-sm mt-1">Track and manage your performance requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-md">
                <Music className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200/50 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Requests</p>
                <h3 className="text-2xl font-bold mt-1 font-display">{stats.totalRequests}</h3>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <Music className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200/50 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
                <h3 className="text-2xl font-bold mt-1 font-display">{stats.pendingRequests}</h3>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200/50 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed</p>
                <h3 className="text-2xl font-bold mt-1 font-display">{stats.acceptedRequests}</h3>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-xs border border-gray-200/50 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Spent</p>
                <h3 className="text-2xl font-bold mt-1 font-display">₹{stats.totalSpent.toLocaleString()}</h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200/50 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 font-display">My Performance Requests</h2>
                <p className="text-gray-500 text-sm mt-1">View and manage all your booking requests</p>
              </div>

              {/* Search */}
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg w-fit">
              {[
                { key: 'all', label: 'All Requests', count: requests.length },
                { key: 'pending', label: 'Pending', count: requests.filter(r => r.status === 'pending').length },
                { key: 'accepted', label: 'Accepted', count: requests.filter(r => r.status === 'accepted').length },
                { key: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'completed').length },
                { key: 'cancelled', label: 'Cancelled', count: requests.filter(r => r.status === 'cancelled' || r.status === 'rejected').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                      : 'bg-yellow text-white-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label} <span className="text-gray-500 font-normal">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Requests List */}
          <div className="divide-y divide-gray-100">
            {filteredRequests.map((request) => (
              <div key={request._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  {/* Main Info */}
                  <div className="flex-1 lg:pr-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 font-display">{request.eventType}</h3>
                        <p className="text-indigo-600 font-medium text-sm mt-0.5">{request.artist?.name || 'No artist name'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                        {formatDate(request.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                        {request.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 text-indigo-500" />
                        ₹{request.amount.toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-indigo-500" />
                        {request.crowdSize}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Headphones className="w-4 h-4 mr-2 text-indigo-500" />
                        {request.crowdType}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200/50">
                        <strong className="font-medium text-gray-700">Description:</strong> {request.description}
                      </p>
                      {request.artistNotes && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200/50">
                          <strong className="font-medium text-gray-700">Artist Notes:</strong> {request.artistNotes}
                        </p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {request.artist?.email && (
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1.5 text-indigo-400" />
                          {request.artist.email}
                        </div>
                      )}
                      {request.artist?.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1.5 text-indigo-400" />
                          {request.artist.phone}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5 text-indigo-400" />
                        Requested on {formatDate(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-4 lg:mt-0 lg:ml-4 min-w-[180px]">
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleRequestAction(request._id, 'cancelled')}
                        className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium shadow-xs"
                      >
                        <X className="w-4 h-4 mr-1.5" />
                        Cancel Request
                      </button>
                    )}
                    {request.status === 'accepted' && (
                      <button
                        onClick={() => handleRequestAction(request._id, 'completed')}
                        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium shadow-xs"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        Mark as Completed
                      </button>
                    )}
                    <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-xs">
                      <MessageSquare className="w-4 h-4 mr-1.5 text-gray-500" />
                      Message Artist
                    </button>
                    {request.status === 'completed' && (
                      <button className="flex items-center justify-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium shadow-xs">
                        <Star className="w-4 h-4 mr-1.5" />
                        Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredRequests.length === 0 && (
              <div className="p-12 text-center">
                <Music className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium font-display">No requests found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    <Footer />
  </>
);
};

export default UserRequests;