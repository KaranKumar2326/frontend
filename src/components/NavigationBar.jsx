import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import myImage from '../public/logo.jpeg';
import './NavigationBar.css'; // Updated to use NavigationBar.css instead of LoggedInHomePage.css
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast notifications

const NavigationBar = ({ hideProfile = false, userProfilePic, showHomeInDropdown = false }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const [openProfile, setOpenProfile] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch role from backend if logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');
    if (isLoggedIn && email && userId) {
      fetch(`http://localhost:3001/api/auth/get-role?email=${encodeURIComponent(email)}&userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.role) setUserRole(data.role);
        })
        .catch(() => setUserRole(null));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('token'); // If you are storing the token too
    localStorage.removeItem('userId'); // Remove userId if stored
    toast.success('Logged out successfully');
    console.log('User logged out');
    navigate('/login');
  };

  // Helper function for smooth scrolling
  const scrollToSection = (id) => {
    // Try to scroll to the element, and if not found, try scrolling to the footer tag
    let el = document.getElementById(id);
    if (!el && id === 'footer') {
      el = document.querySelector('footer');
    }
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hide nav items on artist profile page
  const isArtistProfilePage = location.pathname.startsWith('/artist-profile/');
  const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';

  // Function to handle My Profile navigation
  const handleProfileNavigation = async () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = userRole || localStorage.getItem('role');
    const token = localStorage.getItem('token');
    
    
    if (role === 'user') {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        return;
      }
      // Navigate to profile page with user ID
      navigate(`/ProfilePage/${userId}`);
    } else if (role === 'artist') {
      const artistId = localStorage.getItem('artist_id');
      if (!artistId) {
        toast.error('Artist ID not found. Please log in again.');
        return;
      }

      try {
        // Fetch artist profile to check if it's complete
        const response = await fetch(`http://localhost:3001/api/artists/${artistId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const artistData = await response.json();
          // Check if profile is complete (same logic as in backend)
          const requiredFields = ['bio', 'description', 'instruments', 'genres', 'pricePerHour'];
          const isProfileComplete = requiredFields.every(field => {
            const value = artistData[field];
            return value !== undefined && value !== null && 
                   (Array.isArray(value) ? value.length > 0 : value !== '');
          });

          if (!isProfileComplete) {
            navigate(`/publicartistprofilepage/${artistId}`, { 
              state: { incompleteProfile: true } 
            });
          } else {
            navigate(`/publicartistprofilepage/${artistId}`);
          }
        } else {
          // If we can't fetch the profile, just navigate to the public page
          navigate(`/publicartistprofilepage/${artistId}`);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        navigate(`/publicartistprofilepage/${artistId}`);
      }
    }
    setOpenProfile(false);
  };

  // Function to handle Home navigation for dropdown
  const handleHomeNavigation = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = userRole || localStorage.getItem('role');
    if (isLoggedIn && role === 'user') {
      navigate('/loggedInHome');
    } else if (isLoggedIn && role === 'artist') {
      navigate('/loggedInHomePageArtist');
    } else {
      navigate('/');
    }
    setOpenProfile(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <a className="navbar-brand" onClick={() => {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const role = localStorage.getItem('role');
            if (isLoggedIn && role === 'user') {
              navigate('/loggedInHome');
            } else if (isLoggedIn && role === 'artist') {
              navigate('/loggedInHomePageArtist');
            } else {
              navigate('/');
            }
          }} style={{ cursor: 'pointer' }}>
            <span className="navbar-title">Musical Meet</span>
          </a>
        </div>
        <div className="navbar-as">
          <a className="navbar-a" href="#" onClick={e => {
            e.preventDefault();
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const role = localStorage.getItem('role');
            if (isLoggedIn && role === 'user') {
              navigate('/loggedInHome');
            } else if (isLoggedIn && role === 'artist') {
              navigate('/loggedInHomePageArtist');
            } else {
              navigate('/');
            }
          }}>Home</a>
          <a className="navbar-a" href="#footer" onClick={e => { e.preventDefault(); scrollToSection('footer'); }}>Contact Us</a>
          <a className='navbar-a' href="#" onClick={e => { e.preventDefault(); navigate('/how-it-works'); }}>How it Works</a>

          {!isLoginOrSignup && (
            <>
              {/* Hide Browse Artists and Hire an Artist on Signup and artist profile page, but keep profile pic and dropdown on artist profile page */}
              {location.pathname !== '/signup' && location.pathname !== '/home' && location.pathname !== '/loggedInHomePageArtist' && !isArtistProfilePage && (
                <>
                  <a className="navbar-a" href="#featured-artists" onClick={e => { e.preventDefault(); scrollToSection('featured-artists'); }}>Browse Artists</a>
                  <button className="navbar-button" onClick={() => navigate('/all-artists')}>Hire an Artist</button>
                  {/* Only show Sign Up button if hideProfile is true (i.e., HomePage.js) */}
                  {hideProfile && (
                    <button className="navbar-button" onClick={() => navigate('/signup')}>Sign Up</button>
                  )}
                </>
              )}
              {/* Always show profile pic and dropdown except on signup/home/artist home */}
              {location.pathname !== '/signup' && location.pathname !== '/home' && location.pathname !== '/loggedInHomePageArtist' && !isArtistProfilePage && !userProfilePic && (
                !hideProfile && (
                  <img src={myImage} className="user-pfp" onClick={() => setOpenProfile((prev) => !prev)} />
                )
              )}
              {location.pathname === '/loggedInHomePageArtist' && !userProfilePic && (
                <>
                  <button className="navbar-button" onClick={() => navigate('/login')}>Inquiries</button>
                  {!hideProfile && (
                    <img src={myImage} className="user-pfp" onClick={() => setOpenProfile((prev) => !prev)} />
                  )}
                </>
              )}
              {/* Show artist profile pic if userProfilePic prop is provided (for public artist profile page) */}
              {userProfilePic && (
                <img src={userProfilePic} className="user-pfp" onClick={() => setOpenProfile((prev) => !prev)} />
              )}
              {!hideProfile && openProfile && (
                <div className="flex flex-col dropdown">
                  <ul className="dropcont">
                    {showHomeInDropdown ? (
                      <li onClick={handleHomeNavigation}>Home</li>
                    ) : (
                      <li onClick={handleProfileNavigation}>My Profile</li>
                    )}
                    <li>Settings</li>
                    <li onClick={handleLogout}>Logout</li>
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;