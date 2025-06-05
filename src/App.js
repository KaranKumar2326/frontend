// App.js
import React, { useState, useEffect } from 'react';
import { useLocation ,BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/Login/Signup';
import CardList from './components/CardList';
import HomePage from './components/HomePage/HomePage';
import AboutPage from './components/AboutPage'; // Import AboutPage
import EventPage from './components/EventPage'; // Import EventPage
import LoginAsArtist from './components/Login/LoginAsArtist';
import LoggedInHomePage from './components/HomePage/LoggedInHomePage';
import LoggedInHomePageArtist from './components/HomePage/LoggedInHomePageArtist';
import ArtistProfilePage from './components/HomePage/ArtistProfilePage';
import AllArtistsPage from './components/HomePage/AllArtistsPage'; // Import AllArtistsPage
import JammingPage from './components/Jamming'; // Import JammingPage 

// import './App.css'; // Import your main CSS file
import './index.css'; // Import Tailwind CSS

const dummyCards = [
  {
    name: "John Doe",
    genre: "Rock",
    place: "New York",
    photo: "https://via.placeholder.com/150",
  },
  {
    name: "Jane Smith",
    genre: "Jazz",
    place: "Los Angeles",
    photo: "https://via.placeholder.com/150",
  },
  // more cards...
];
import HowItWorksPage from './components/HowItWorksPage';
import ProfilePage from './components/HomePage/ProfilePage';
import PublicArtistPage from './components/HomePage/PublicArtistPage'; // Import PublicArtistPage
import PublicArtistProfilePage from './components/HomePage/PublicArtistProfilePage';
import { useParams } from 'react-router-dom';


function AppContent({ isLoggedIn, handleLogout, handleLogin }) {
  const location = useLocation();


  return (
    <>
      {/* {location.pathname !== '/' && location.pathname !== '/home' && location.pathname !== '/loggedInHome' && <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/jamming" element={<JammingPage />} /> 
        <Route path="/loggedInHome" element={<LoggedInHomePage />} />
        <Route path="/loggedInHomePageArtist" element={<LoggedInHomePageArtist />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/loginAsArtist" element={<LoginAsArtist />} />
        <Route path="/cards" element={<CardList />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/artist-profile/:id" element={<ArtistProfilePage />} />
        <Route path="/ArtistProfilePage/:artistId" element={<ArtistProfilePage />} />
        <Route path="/all-artists" element={<AllArtistsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/public-artist/:id" element={<PublicArtistPage />} />
        <Route path="/publicartistprofilepage/:id" element={<PublicArtistProfilePage />} />
      </Routes>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status when App first loads
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLogin={handleLogin} />
    </Router>
  );
}

export default App;
