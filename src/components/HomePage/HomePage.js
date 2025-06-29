import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube ,Search , Headphones , CalendarCheck} from "lucide-react";
import "./Footer.css";
import {motion} from "framer-motion";
import CallToAction from './CalltoAction';
import FeaturedArtist from './FeaturedArtist';
import Testimonials from './Testimonials';
import NavigationBar from '../NavigationBar'; // Importing the NavigationBar component
import Footer from './Footer'; // Importing the new Footer component
import ImageSlider from './ImageSlider';

export const Motion = motion;

const HomePage = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [galleryMedia, setGalleryMedia] = React.useState([]);

  const handleHireArtistClick = () => {
    navigate('/login');
  };

  const JoinAsArtist = () => {
    navigate('/login');
  };

  // Helper to convert Google Drive links to direct image links and proxy through backend
  const getImageSrc = (url) => {
    if (!url) return null;
    let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
    if (!match) {
      match = url.match(/[?&]id=([\w-]+)/);
    }
    let directUrl = url;
    if (match && match[1]) {
      directUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    // Always proxy through backend for CORS
    return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
  };

  React.useEffect(() => {
    // Fetch all artists and collect all non-null images and videos from galleryImages and videos
    fetch('http://localhost:3001/api/artists')
      .then(res => res.json())
      .then(data => {
        let allGalleryMedia = [];
        data.forEach(artist => {
          // Images
          if (Array.isArray(artist.galleryImages)) {
            const validImages = artist.galleryImages.filter(img => !!img);
            allGalleryMedia = allGalleryMedia.concat(validImages.map(img => ({ type: 'image', src: getImageSrc(img) })));
          }
          // Videos (Google Drive links)
          if (Array.isArray(artist.videos)) {
            const getVideoSrc = (url) => {
              if (!url) return null;
              let match = url.match(/(?:file\/d\/|open\?id=|uc\?id=)([\w-]+)/);
              if (!match) {
                match = url.match(/[?&]id=([\w-]+)/);
              }
              let directUrl = url;
              if (match && match[1]) {
                directUrl = `https://drive.google.com/uc?export=download&id=${match[1]}`;
              }
              return `http://localhost:3001/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
            };
            const validVideos = artist.videos.filter(v => !!v);
            allGalleryMedia = allGalleryMedia.concat(validVideos.map(videoUrl => ({ type: 'video', src: getVideoSrc(videoUrl) })));
          }
        });
        // Shuffle the array to get random media
        for (let i = allGalleryMedia.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allGalleryMedia[i], allGalleryMedia[j]] = [allGalleryMedia[j], allGalleryMedia[i]];
        }
        setGalleryMedia(allGalleryMedia);
      })
      .catch(() => setGalleryMedia([]));
  }, []);

  return (
    <>
      <NavigationBar hideProfile /> {/* Adding the NavigationBar component with hideProfile prop */}
      <div className="page-container fancy-background" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', margin: '0 auto' , padding:'0px'}}>
        {/* <div className='hero-container' style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}> */}
          <div className="background-image">
          </div>
            <header className="hero-section" style={{ zIndex: 1, height:'100vh', padding: '20px', boxSizing: 'border-box', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
              <div className='content'>
                <div>
                  <h1 className="hero-title" style={{ color: 'white', fontWeight: 'bold', marginBottom: '20px', fontSize: '3rem' }}>Welcome to Musical Meet</h1>
                </div>
                <div>
                  <p className="hero-subtitle" style={{ color: 'white', fontWeight: 'bold', marginBottom: '30px', fontSize: '1.5rem' }}>
                  Join us in celebrating the joy of music and connecting with artists from around the world.
                  </p>
                </div>
                <div className="button-container" style={{ display: 'flex', gap: '10px', justifyContent: 'left' }}>
                  <button 
                    className="P" 
                    style={{fontWeight:'bold', padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#6c2bd9', color: 'white', border: '3px',borderColor:'#f0e11a', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    onClick={handleHireArtistClick}
                  >
                    Hire an Artist
                  </button>
                  <button className="Y" style={{fontWeight:'bold', padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#f0e11a',color :'#6c2bd9' , border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                  onClick={JoinAsArtist}>
                    Join as a Artist
                  </button>
                </div>
              </div>
            </header>
        {/* </div> */}
      </div>
      <FeaturedArtist /> 
      
      <Testimonials/>
      <CallToAction/>
      {/* Image Slider Section */}
      <div className="image-slider-section">
        <h2 className="slider-heading" style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '2.8rem', textAlign: 'center', letterSpacing: '1px' }}>Gallery</h2>
        <ImageSlider media={galleryMedia} />
      </div>
      <Footer id="footer" />
    </>
  );
};

export default HomePage;