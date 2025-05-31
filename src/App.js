// App.js
import React, { useState, useEffect } from 'react';
import { useLocation ,BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/LoginForm';
import SignUp from './components/SignupForm';
import CardList from './components/CardList';
import HomePage from './components/HomePage/HomePage';
import Navbar from '../src/components/NavigationBar'
import AboutPage from './components/AboutPage'; // Import AboutPage
import LoginAsArtist from './components/Login/LoginAsArtist';
import LoggedInHomePage from './components/HomePage/LoggedInHomePage';
import LoggedInHomePageArtist from './components/HomePage/LoggedInHomePageArtist';
import ArtistProfilePage from './components/HomePage/ArtistProfilePage';
import Footer from './components/HomePage/Footer';
import AllArtistsPage from './components/HomePage/AllArtistsPage'; // Import AllArtistsPage

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

function AppContent({ isLoggedIn, handleLogout, handleLogin }) {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== '/' && location.pathname !== '/home' && location.pathname !== '/loggedInHome' && <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/loggedInHome" element={<LoggedInHomePage />} />
        <Route path="/loggedInHomePageArtist" element={<LoggedInHomePageArtist />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/loginAsArtist" element={<LoginAsArtist />} />
        <Route path="/cards" element={<CardList />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/artist-profile/:id" element={<ArtistProfilePage />} />
        <Route path="/all-artists" element={<AllArtistsPage />} />
      </Routes>
      <Footer />
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
