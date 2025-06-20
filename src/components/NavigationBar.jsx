import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import myImage from '../public/logo.jpeg';
import './NavigationBar.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const NavigationBar = ({ hideProfile = false, userProfilePic, showHomeInDropdown = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openProfile, setOpenProfile] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Add scroll listener for navbar effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch role from backend if logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('email');
    const userId = localStorage.getItem('userId');
    if (isLoggedIn && email && userId) {
      fetch(`https://backend-musical.onrender.com/api/auth/get-role?email=${encodeURIComponent(email)}&userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.role) setUserRole(data.role);
        })
        .catch(() => setUserRole(null));
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.navbar-container')) {
        setIsMobileMenuOpen(false);
      }
      if (openProfile && !event.target.closest('.profile-section')) {
        setOpenProfile(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen, openProfile]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const scrollToSection = (id) => {
    const el = id === 'footer' 
      ? document.querySelector('footer') || document.getElementById(id)
      : document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const isArtistProfilePage = location.pathname.startsWith('/artist-profile/');
  const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';

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
      navigate(`/ProfilePage/${userId}`);
    } else if (role === 'artist') {
      const artistId = localStorage.getItem('artist_id');
      if (!artistId) {
        toast.error('Artist ID not found. Please log in again.');
        return;
      }

      try {
        const response = await fetch(`https://backend-musical.onrender.com/api/artists/${artistId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const artistData = await response.json();
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
          navigate(`/publicartistprofilepage/${artistId}`);
        }
      } catch (error) {
        console.error('Error checking profile status:', error);
        navigate(`/publicartistprofilepage/${artistId}`);
      }
    }
    setOpenProfile(false);
    setIsMobileMenuOpen(false);
  };

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
    setIsMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleBrandClick = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    if (isLoggedIn && role === 'user') {
      navigate('/loggedInHome');
    } else if (isLoggedIn && role === 'artist') {
      navigate('/loggedInHomePageArtist');
    } else {
      navigate('/');
    }
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    handleHomeNavigation();
  };

 return (
  <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
    <div className="navbar-container">
      <div className="navbar-brand-container" onClick={handleBrandClick}>
        <span className="navbar-title">Musical Meet</span>
      </div>

      <button 
        className={`hamburger ${isMobileMenuOpen ? 'is-active' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsMobileMenuOpen(!isMobileMenuOpen);
        }}
        aria-label="Toggle navigation"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
        
        {/* Profile section for MOBILE - appears first (before Home) */}
        {!isLoginOrSignup && !hideProfile && isMobileMenuOpen && (
          <div className="profile-section mobile-profile">
            {(userProfilePic || (!hideProfile && location.pathname !== '/signup' && location.pathname !== '/home')) && (
              <div className="profile-pic-container" onClick={() => setOpenProfile(!openProfile)}>
                <img 
                  src={userProfilePic || myImage} 
                  className="profile-pic" 
                  alt="Profile" 
                />
                {openProfile && (
                  <div className="profile-dropdown">
                    <div className="dropdown-item" onClick={showHomeInDropdown ? handleHomeNavigation : handleProfileNavigation}>
                      {showHomeInDropdown ? 'Home' : 'My Profile'}
                    </div>
                    <div className="dropdown-item">Settings</div>
                    <div className="dropdown-item" onClick={handleLogout}>Logout</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

          <a className="nav-link" href="#" onClick={handleHomeClick}>Home</a>
          <a className="nav-link" href="#footer" onClick={(e) => { e.preventDefault(); scrollToSection('footer'); }}>Contact</a>
          <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/how-it-works'); }}>How it Works</a>
          
          {!isLoginOrSignup && location.pathname !== '/signup' && 
           location.pathname !== '/home' && location.pathname !== '/loggedInHomePageArtist' && 
           !isArtistProfilePage && (
            <>
              <a className="nav-link" href="#featured-artists" onClick={(e) => { e.preventDefault(); scrollToSection('featured-artists'); }}>Artists</a>
              <button className="nav-button primary" onClick={() => handleNavigation('/all-artists')}>Hire an Artist</button>
              {hideProfile && (
                <button className="nav-button secondary" onClick={() => handleNavigation('/signup')}>Sign Up</button>
              )}
            </>
          )}

          {/* Profile section for DESKTOP - appears last */}
          {!isLoginOrSignup && !hideProfile && !isMobileMenuOpen && (
            <div className="profile-section desktop-profile">
              {(userProfilePic || (!hideProfile && location.pathname !== '/signup' && location.pathname !== '/home')) && (
                <div className="profile-pic-container" onClick={() => setOpenProfile(!openProfile)}>
                  <img 
                    src={userProfilePic || myImage} 
                    className="profile-pic" 
                    alt="Profile" 
                  />
                  {openProfile && (
                    <div className="profile-dropdown">
                      <div className="dropdown-item" onClick={showHomeInDropdown ? handleHomeNavigation : handleProfileNavigation}>
                        {showHomeInDropdown ? 'Home' : 'My Profile'}
                      </div>
                      <div className="dropdown-item">Settings</div>
                      <div className="dropdown-item" onClick={handleLogout}>Logout</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  </nav>
);
};

export default NavigationBar;