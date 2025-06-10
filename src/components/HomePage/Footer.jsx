import React from 'react';
import { Music, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import "./Footer.css";

const Footer = () => (
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
        </div>

        {/* Quick as */}
        <div>
          <h3 className="footer-heading">Quick as</h3>
          <ul className="footer-as">
            <li><a href="/artists" className="footer-a"><a>Browse Artists</a></a></li>
            {/* <li><a href="/#how-it-works" className="footer-a"><a>How It Works</a></a></li> */}
            <li><a href="/#testimonials" className="footer-a"><a>Testimonials</a></a></li>
            <li><a href="/join" className="footer-a"><a>Join as Artist</a></a></li>
            {/* <li><a href="#" className="footer-a"><a>Blog & Resources</a></a></li> */}
          </ul>
        </div>

        {/* For Musicians */}
        <div>
          <h3 className="footer-heading">For Musicians</h3>
          <ul className="footer-as">
            <li><a href="/join"className='footer-a'><a>Join as a Artist</a></a></li>
            {/* <li><a href="#" className="footer-a"><a>Success Stories</a></a></li> */}
            {/* <li><a href="#" className="footer-a"><a>Pricing & Commissions</a></a></li> */}
            <li><a href="/faq" className="footer-a"><a>FAQ for Artists</a></a></li>
            <li><a href="/#testimonials" className="footer-a"><a>Testimonials</a></a></li>
            {/* <li><a href="#" className="footer-a"><a>Resources</a></a></li> */}
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

          <div className="footer-socials">
            <a href="#" className="footer-a"><Facebook size={20} /></a>
            <a href="https://www.instagram.com/musicalmeet07/" className="footer-a"><Instagram size={20} /></a>
            <a href="https://x.com/musicalmeeet" className="footer-a"><Twitter size={20} /></a>
            <a href="https://www.linkedin.com/company/musical-meet/" className="footer-a"><Linkedin size={20} /></a>
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
);

export default Footer;
