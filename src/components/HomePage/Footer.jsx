import React from 'react';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-grid">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-brand">
            <span className="footer-brand-icon"><Music /></span>
            <span className="footer-brand-name">Musical Meet</span>
          </div>
          <p className="footer-description">
            Connecting musical talent with event planners and individuals seeking exceptional live performances.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/all-artists" className="footer-link">Browse Artists</a></li>
            <li><a href="/#testimonials" className="footer-link">Testimonials</a></li>
            <li><a href="/login" className="footer-link" onClick={e => { e.preventDefault(); window.location.href = '/login?signup=1&artist=0'; }}>Join as a User</a></li>
          </ul>
        </div>

        {/* For Musicians */}
        <div className="footer-section">
          <h3 className="footer-heading">For Musicians</h3>
          <ul className="footer-links">
            <li><a href="/login" className="footer-link" onClick={e => { e.preventDefault(); window.location.href = '/login?signup=1&artist=1'; }}>Join as an Artist</a></li>
            <li><a href="/faq" className="footer-link">FAQ for Artists</a></li>
            <li><a href="/#testimonials" className="footer-link">Testimonials</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-contact">
            <li>
              <Phone className="contact-icon" />
              <span>7779887407</span>
            </li>
            <li>
              <Mail className="contact-icon" />
              <span>musicalmeet07@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Media */}
      <div className="footer-socials">
        <a href="#" className="social-link" aria-label="Facebook">
          <Facebook size={20} />
        </a>
        <a href="https://www.instagram.com/musicalmeet07/" className="social-link" aria-label="Instagram">
          <Instagram size={20} />
        </a>
        <a href="https://x.com/musicalmeeet" className="social-link" aria-label="Twitter">
          <Twitter size={20} />
        </a>
        <a href="https://www.linkedin.com/company/musical-meet/" className="social-link" aria-label="LinkedIn">
          <Linkedin size={20} />
        </a>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p className="copyright">&copy; {new Date().getFullYear()} Musical Meet. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#" className="footer-link">Privacy Policy</a>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;