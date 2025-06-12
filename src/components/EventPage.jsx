import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Headphones, 
  DollarSign, 
  Users, 
  Clock,
  ArrowLeft,
  Ticket,
  Mic2,
  User,
  Music,
  Share2,
  Heart
} from "lucide-react";

const EventPage = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  // Example event data (in a real app, you'd fetch this from an API)
  const eventsData = [
    {
      _id: 1,
      title: "Rock Jam Session",
      date: "June 15, 2025",
      time: "7:00 PM - 10:00 PM",
      location: "Central Park, New York",
      address: "59th to 110th Street, Manhattan, NY",
      capacity: "150/200",
      genre: "Rock",
      description: "Join us for an electrifying rock jam session in the heart of Central Park! Musicians of all skill levels welcome. Bring your guitars, drums, and voices for an unforgettable night of classic and contemporary rock.",
      isPaid: false,
      image: "🎸",
      organizer: "NYC Rock Collective",
      requirements: "Bring your own instrument if possible. Drums and amps will be provided.",
      performers: ["The Amp Tones", "Fret Burners", "Open Mic Slots Available"]
    },
    {
      _id: 2,
      title: "Jazz Night Jam",
      date: "June 17, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Jazz Club, Los Angeles",
      address: "123 Swing Street, Los Angeles, CA",
      capacity: "50/100",
      genre: "Jazz",
      description: "An intimate evening of jazz improvisation with some of LA's finest musicians. Whether you're a player or listener, come enjoy the smooth sounds of jazz in our cozy club setting.",
      isPaid: true,
      price: "30",
      image: "🎷",
      organizer: "West Coast Jazz Society",
      requirements: "Dress code: Smart casual. Instruments provided for jam participants.",
      performers: ["The Cool Cats Quartet", "Sax Appeal", "Piano Bar Open Jam"]
    },
    // ... other events from your JammingPage data
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchEvent = () => {
      setTimeout(() => {
        const foundEvent = eventsData.find(e => e._id === parseInt(_id));
        setEvent(foundEvent);
        setLoading(false);
      }, 500);
    };

    fetchEvent();
  }, [_id]);

  const getGenreColor = (genre) => {
    const colors = {
      'Rock': 'bg-gradient-to-r from-red-500 to-rose-600',
      'Jazz': 'bg-gradient-to-r from-amber-500 to-yellow-500',
      'Hip-Hop': 'bg-gradient-to-r from-purple-500 to-violet-600',
      'Pop': 'bg-gradient-to-r from-pink-500 to-rose-500',
      'Acoustic': 'bg-gradient-to-r from-green-500 to-emerald-600'
    };
    return colors[genre] || 'bg-gradient-to-r from-orange-500 to-red-500';
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Event link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl text-center">
          <div className="animate-pulse text-6xl mb-4">🎵</div>
          <h3 className="text-2xl font-bold text-gray-800">Loading event...</h3>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-12 shadow-2xl text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Event not found</h3>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <button 
            onClick={handleBackClick}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} /> Back to events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 pb-20">
  {/* Header with back button */}
  <div className="w-full px-4 pt-8">
    <button 
      onClick={handleBackClick}
      className="flex items-center gap-2 text-white hover:text-orange-200 transition-colors mb-8 ml-4"
    >
      <ArrowLeft size={20} /> Back to events
    </button>
  </div>

  {/* Main event content - now full width */}
  <div className="w-full px-4">
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl mx-auto max-w-7xl">
      {/* Event header with image and basic info */}
      <div className={`relative ${getGenreColor(event.genre)} p-8 text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
            <p className="text-xl opacity-90">{event.genre} Jam Session</p>
          </div>
          <div className="text-6xl">{event.image}</div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4 mt-6">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full ${isLiked ? 'bg-white text-red-500' : 'bg-white/20 text-white'} transition-colors`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={handleShare}
            className="p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Event details */}
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
            <p className="text-gray-600 mb-8">{event.description}</p>
            
            <div className="bg-orange-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Mic2 size={18} className="text-orange-500" /> Performance Details
              </h3>
              <ul className="space-y-2">
                {event.performers.map((performer, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <User size={14} className="text-orange-500" /> {performer}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Music size={18} className="text-orange-500" /> Requirements
              </h3>
              <p className="text-gray-700">{event.requirements}</p>
            </div>
          </div>

          {/* Sidebar with key info */}
          <div>
            <div className="sticky top-8 space-y-6">
              {/* Date and time */}
              <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Date & Time</h3>
                <div className="flex items-center gap-3 text-gray-700 mb-3">
                  <Calendar size={18} className="text-orange-500" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock size={18} className="text-orange-500" />
                  <span>{event.time}</span>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Location</h3>
                <div className="flex items-start gap-3 text-gray-700 mb-3">
                  <MapPin size={18} className="text-orange-500 mt-1" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.address}</p>
                  </div>
                </div>
                <button className="mt-4 text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors">
                  View on map
                </button>
              </div>

              {/* Organizer */}
              <div className="bg-white border border-orange-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Organizer</h3>
                <div className="flex items-center gap-3 text-gray-700">
                  <User size={18} className="text-orange-500" />
                  <span>{event.organizer}</span>
                </div>
              </div>

              {/* Ticket/RSVP */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Join the Jam</h3>
                    <div className="flex items-center gap-2 text-sm opacity-90 mt-1">
                      <Users size={14} /> {event.capacity} spots available
                    </div>
                  </div>
                  {event.isPaid ? (
                    <div className="bg-white text-orange-500 px-4 py-2 rounded-lg font-bold">
                      ${event.price}
                    </div>
                  ) : (
                    <div className="bg-white text-green-500 px-4 py-2 rounded-lg font-bold">
                      FREE
                    </div>
                  )}
                </div>
                <button className="w-full bg-blue text-orange-500 py-3 rounded-lg font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                  <Ticket size={18} /> {event.isPaid ? 'Buy Ticket' : 'RSVP Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default EventPage;