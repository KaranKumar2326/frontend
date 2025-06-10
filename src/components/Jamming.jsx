import React, { useState } from 'react';
import { Calendar, MapPin, Headphones, DollarSign, Search, Users, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const JammingPage = () => {
  
  // Example event data (replace with real data from your backend)
  const events = [
    {
      _id: 1,
      title: "Rock Jam Session",
      date: "June 15, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Central Park, New York",
      capacity: "150/200",
      genre: "Rock",
      isPaid: false,
      image: "🎸"
    },
    {
      _id: 2,
      title: "Jazz Night Jam",
      date: "June 17, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Jazz Club, Los Angeles",
      capacity: "50/100",
      genre: "Jazz",
      isPaid: true,
      price: "30",
      image: "🎷"
    },
    {
      _id: 3,
      title: "Hip-Hop Jam Session",
      date: "June 20, 2025",
      time: "8:00 PM - 11:00 PM",
      location: "Music Studio, Chicago",
      capacity: "30/50",
      genre: "Hip-Hop",
      isPaid: false,
      image: "🎤"
    },
    {
      _id: 4,
      title: "Pop Music Jam",
      date: "June 22, 2025",
      time: "5:00 PM - 8:00 PM",
      location: "City Square, Miami",
      capacity: "200/300",
      genre: "Pop",
      isPaid: true,
      price: "20",
      image: "🎹"
    },
    {
      _id: 5,
      title: "Acoustic Evening Jam",
      date: "June 25, 2025",
      time: "4:00 PM - 7:00 PM",
      location: "Beachside Cafe, San Francisco",
      capacity: "100/150",
      genre: "Acoustic",
      isPaid: false,
      image: "🎸"
    },
    {
      _id: 6,
      title: "Indie Music Jam",
      date: "June 28, 2025",
      time: "3:00 PM - 6:00 PM",
      location: "Downtown Park, Seattle",
      capacity: "80/100",
      genre: "Indie",
      isPaid: true,
      price: "15",
      image: "🎶"
    }
  ];

  const [filters, setFilters] = useState({
    location: '',
    genre: '',
    paid: null,
    date: '',
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

const handleEventClick = (_id) => {
  navigate(`/event/${_id}`);
};

  const getGenreColor = (genre) => {
    const colors = {
      'Rock': 'from-red-500 to-rose-600',
      'Jazz': 'from-amber-500 to-yellow-500',
      'Hip-Hop': 'from-purple-500 to-violet-600',
      'Pop': 'from-pink-500 to-rose-500',
      'Acoustic': 'from-green-500 to-emerald-600'
    };
    return colors[genre] || 'from-orange-500 to-red-500';
  };

  const filteredEvents = events.filter((event) => {
    const locationMatch = event.location.toLowerCase().includes(filters.location.toLowerCase());
    const genreMatch = event.genre.toLowerCase().includes(filters.genre.toLowerCase());
    const dateMatch = filters.date ? event.date === filters.date : true;
    const paidMatch = filters.paid !== null ? event.isPaid === (filters.paid === "true") : true ;
    return locationMatch && genreMatch && dateMatch && paidMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-pink-600">
      

      {/* Filter Section */}
      <div className="container mx-auto mb-16 px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Search className="text-orange-500" size={24} />
            Find Your Perfect Jam
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 background-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={18} />
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 hover:border-orange-300 shadow-md"
                placeholder="Search location..."
              />
            </div>
            
            <div className="relative group">
              <Headphones className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={18} />
              <select
                name="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 hover:border-orange-300 appearance-none cursor-pointer shadow-md"
              >
                <option value="">All Genres</option>
                <option value="Rock">Rock</option>
                <option value="Jazz">Jazz</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Pop">Pop</option>
                <option value="Acoustic">Acoustic</option>
              </select>
            </div>
            
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={18} />
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 hover:border-orange-300 shadow-md"
              />
            </div>
            
            <div className="relative group">
              <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" size={18} />
              <select
                name="paid"
                value={filters.paid || ''}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-300 hover:border-orange-300 appearance-none cursor-pointer shadow-md"
              >
                <option value=" ">All Events</option>
                <option value="true">Paid Events</option>
                <option value="false">Free Events</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Event List Section */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="group relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 border border-orange-200 hover:border-orange-400 cursor-pointer transition-all duration-500 ease-out hover:transform hover:scale-105 hover:-rotate-1 shadow-xl hover:shadow-2xl"
              onClick={() => handleEventClick(event._id)}
            >
              {/* Genre badge */}
              <div className={`absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-r ${getGenreColor(event.genre)} rounded-2xl flex items-center justify-center text-2xl transform rotate-12 group-hover:rotate-0 transition-transform duration-300 shadow-lg`}>
                {event.image}
              </div>
              
              {/* Card content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 group-hover:text-orange-600 transition-colors duration-300">
                  {event.title}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="p-2 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors duration-300">
                      <Calendar size={16} className="text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{event.date}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors duration-300">
                      <MapPin size={16} className="text-red-600" />
                    </div>
                    <span className="font-medium text-gray-800">{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="p-2 bg-pink-100 rounded-xl group-hover:bg-pink-200 transition-colors duration-300">
                      <Users size={16} className="text-pink-600" />
                    </div>
                    <span className="font-medium text-gray-800">{event.capacity} attendees</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="p-2 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors duration-300">
                      <Headphones size={16} className="text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-800">{event.genre}</span>
                  </div>
                </div>
                
                {/* Price tag */}
                <div className="mt-6 flex justify-between items-center">
                  <div className={`px-5 py-3 rounded-2xl font-bold text-lg shadow-md ${
                    event.isPaid 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                  }`}>
                    {event.isPaid ? `${event.price}` : "FREE"}
                  </div>
                  
                  <div className="text-orange-600 font-bold text-lg group-hover:text-red-600 transition-colors duration-300">
                    Join Now →
                  </div>
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl inline-block">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-600">Try adjusting your filters to find more jam sessions!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JammingPage;