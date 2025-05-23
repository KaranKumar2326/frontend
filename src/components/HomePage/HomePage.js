import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube ,Search , Headphones , CalendarCheck} from "lucide-react";
import "./Footer.css"; 
import {motion} from "framer-motion";
import Header from '../Header'; // Import the reusable Header component
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
            <Header />
        {/* </div> */}
      </div>
      <section className="content-section" style={{ zIndex: 1, maxWidth: '800px', padding: '20px', boxSizing: 'border-box', marginTop: '40px', alignContent: 'center', textAlign: 'left', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <h2 className="section-title" style={{ color: 'black', fontWeight: 'bold', marginBottom: '20px', fontSize: '2rem' }}>Why Join Musical Meet?</h2>
        <p className="section-text" style={{ color: 'black', fontWeight: 'bold', marginBottom: '20px', fontSize: '1.2rem' }}>
          Musical Meet is a platform where artists and music enthusiasts come together to share their passion for music. Whether you're a beginner or a professional, you'll find a welcoming community and opportunities to grow.
        </p>
        <ul className="features-list" style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🎵 Discover new genres and artists</li>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🎤 Showcase your talent</li>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🤝 Network with like-minded individuals</li>
          <li className="feature-item" style={{ color: 'black', fontWeight: 'bold', marginBottom: '10px', fontSize: '1.1rem' }}>🌟 Participate in exclusive events</li>          
        </ul>
      </section>

      {/* Footer */}
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
            <button className='footer-contact-button'>Contact Us</button>
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