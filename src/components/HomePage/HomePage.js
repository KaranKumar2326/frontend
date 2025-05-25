import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube ,Search , Headphones , CalendarCheck} from "lucide-react";
import "./Footer.css";
import {motion} from "framer-motion";
import HowItWorks from './Howitworks';
import CallToAction from './CalltoAction';
import FeaturedArtist from './FeaturedArtist';
import Testimonials from './Testimonials';
export const Motion = motion;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <a className="navbar-brand">
              <span className="navbar-title">Musical Meet</span>
            </a>
          </div>

          <div className="navbar-as">
            <a className="navbar-a">Home</a>
            <a className="navbar-a">Browse Artists</a>
            <a className="navbar-a">How It Works</a>
            <a className="navbar-a">Testimonials</a>
            <a>
              <button className="navbar-button">Join as Artist</button>
            </a>
          </div>
        </div>
      </nav>
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
                  <button className="P" style={{fontWeight:'bold', padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#6c2bd9', color: 'white', border: '3px',borderColor:'#f0e11a', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    Hire an Artist
                  </button>
                  <button className="Y" style={{fontWeight:'bold', padding: '20px 40px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#f0e11a', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    Join as a Artist
                  </button>
                </div>
              </div>
            </header>
        {/* </div> */}
      </div>
      <FeaturedArtist /> 
      <HowItWorks/>
      <Testimonials/>
      <CallToAction/>
      <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div>
            <div className="footer-brand">
              <span className="footer-brand-icon"><Music /></span>
              <span className="footer-brand-name">Musical Meet</span>
            </div>
            <p className="footer-description">
              Connecting musical talent with event planners and individuals seeking exceptional live performances.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-a"><Facebook size={20} /></a>
              <a href="#" className="footer-a"><Instagram size={20} /></a>
              <a href="#" className="footer-a"><Twitter size={20} /></a>
              <a href="#" className="footer-a"><Youtube size={20} /></a>
            </div>
          </div>

          {/* Quick as */}
          <div>
            <h3 className="footer-heading">Quick as</h3>
            <ul className="footer-as">
              <li><a href="/artists" className="footer-a"><a>Browse Artists</a></a></li>
              <li><a href="/#how-it-works" className="footer-a"><a>How It Works</a></a></li>
              <li><a href="/#testimonials" className="footer-a"><a>Testimonials</a></a></li>
              <li><a href="/join" className="footer-a"><a>Join as Artist</a></a></li>
              <li><a href="#" className="footer-a"><a>Blog & Resources</a></a></li>
            </ul>
          </div>

          {/* For Musicians */}
          <div>
            <h3 className="footer-heading">For Musicians</h3>
            <ul className="footer-as">
              <li><a href="/join"className='footer-a'><a>Create Profile</a></a></li>
              <li><a href="#" className="footer-a"><a>Success Stories</a></a></li>
              <li><a href="#" className="footer-a"><a>Pricing & Commissions</a></a></li>
              <li><a href="#" className="footer-a"><a>FAQ for Artists</a></a></li>
              <li><a href="#" className="footer-a"><a>Resources</a></a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-contact">
              <li><MapPin className="icon" /><span>123 Music Avenue, New York, NY 10001</span></li>
              <li><Phone className="icon" /><span>(555) 123-4567</span></li>
              <li><Mail className="icon" /><span>info@musicalmeet.com</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Musical Meet. All rights reserved.</p>
          <div className="footer-bottom-as">
            <a href="#" className="footer-a"><a>Privacy Policy</a></a>
            <a href="#" className="footer-a"><a>Terms of Service</a></a>
            <a href="#" className="footer-a"><a>Cookie Policy</a></a>
          </div>
        </div>
      </div>
    </footer>
    
    </>
  );
};

export default HomePage;