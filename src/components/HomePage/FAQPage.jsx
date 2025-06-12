import React, { useState } from 'react';
import NavigationBar from '../NavigationBar';
import Footer from './Footer';
import '../HowItWorksPage.css';
import { Search, Headphones, CalendarCheck } from "lucide-react";
import { motion } from 'framer-motion';

export default function FAQPage() {
  const [selected, setSelected] = useState('artist');

  return (
    <>
      <NavigationBar />
      <div className="howitworks-main">
        <h1 className="howitworks-title">FAQs</h1>
        <div className="howitworks-options-container">
          {/* Artist Option */}
          <div
            className={`howitworks-option${selected === 'artist' ? ' selected' : ''}`}
            onClick={() => setSelected('artist')}
          >
            <div className="howitworks-option-inner">
              <h2 className="howitworks-option-title">For Artists</h2>
            </div>
          </div>
          {/* Host Option */}
          <div
            className={`howitworks-option${selected === 'host' ? ' selected' : ''}`}
            onClick={() => setSelected('host')}
          >
            <div className="howitworks-option-inner">
              <h2 className="howitworks-option-title">For Users</h2>
            </div>
          </div>
          {/* Move the text content inside the container below the options */}
          <div style={{ width: '100%' }}>
            {selected === 'artist' && (
              <div>
                <p className="howitworks-desc">
                  Promote your artistry, connect with an audience, and receive bookings for paid private 
                  performances and curated jamming sessions.<br/>
                </p>
                <p className='sub-heading'> Set Up Your Profile</p>
                <p className='howitworks-desc'>Showcase your musical expertise with a comprehensive profile featuring your bio, sample 
                  performances, pricing, and availability.</p>
                <p className='sub-heading'>Gain Visibility </p>
                <p className='howitworks-desc'>Get discovered by users seeking live music for private events in your local area.</p>
                <p className='sub-heading'> Accept and Manage Bookings</p>
                <p className='howitworks-desc'>Receive booking requests directly through the platform. Upon accepting, the payment is 
                  processed securely and the performance is confirmed.</p>
                <p className='sub-heading'>Organise Jamming Sessions </p>
                <p className='howitworks-desc'>Host public or exclusive jamming sessions to engage with audiences, experiment creatively, 
                  and generate additional income.</p>
                <p className='sub-heading'>Build Your Reputation</p>
                <p className='howitworks-desc'>Enhance your professional network, gather reviews, and increase your visibility by 
                  consistently delivering high-quality performances.</p>
              </div>
            )}
            {selected === 'host' && (
              <div>
                <p className="howitworks-desc">
                  Engage professional artists to elevate your private events with live performances and discover 
                  unique musical experiences.<br/>
                </p>
                <p className='sub-heading'> Explore Local Talent</p>
                <p className='howitworks-desc'>Browse a curated selection of verified singers, musicians, and performers available in your 
                  city.</p>
                <p className='sub-heading'>Review Artist Profiles</p>
                <p className='howitworks-desc'>View detailed profiles, including performance samples, pricing, availability, and client 
                  feedback to make an informed decision.</p>
                <p className='sub-heading'>Secure a Booking</p>
                <p className='howitworks-desc'>Submit a booking request by paying the artist’s listed rate. Once the artist confirms, the 
                  performance is officially scheduled.</p>
                <p className='sub-heading'>Attend Jamming Sessions</p>
                <p className='howitworks-desc'>Participate in artist-led jamming sessions—an excellent opportunity to enjoy live music in 
                  an intimate setting and connect with emerging talent.</p>
                <p className='sub-heading'>Host Memorable Events</p>
                <p className='howitworks-desc'>Whether for private gatherings, celebrations, or corporate functions, enhance your event 
                  with professionally delivered live entertainment.</p>
              </div>
            )}
            <p className="howitworks-summary">
              Musical Meet connects artists and hosts for unforgettable live music experiences. Whether you're a performer or planning an event, our platform makes it easy, safe, and inspiring to connect and create memorable moments.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
