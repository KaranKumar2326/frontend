// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/LoginForm';
import SignUp from './components/SignupForm';
import CardList from './components/CardList';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import AboutPage from './components/AboutPage'; // Import AboutPage
import LoginAsArtist from './components/LoginAsArtist';

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
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/loginAsArtist" element={<LoginAsArtist />} />
        <Route path="/cards" element={<CardList />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
