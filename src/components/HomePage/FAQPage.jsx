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
                  Artists showcase their talent, hosts discover performers — our platform makes meaningful musical connections happen with ease.
                </p>
                <p className='sub-heading'>Setting Your Fee</p>
                <p className='howitworks-desc'>You set your own “ask price,” which should cover performance time, travel, equipment, and special requests if any.</p>
                <p className='sub-heading'> Receiving & Managing Bookings</p>
                <p className='howitworks-desc'>You receive booking requests via notifications and can accept or reject them. Customers can also chat with you before confirming.</p>
                <p className='sub-heading'>Payments & Payouts</p>
                <p className='howitworks-desc'>Customers pay upfront, and you receive payment after the performance, minus any platform fee.</p>
                <p className='sub-heading'> Cancellations & Penalties</p>
                <p className='howitworks-desc'>Avoid last-minute cancellations, as they may affect your visibility. If a customer cancels late, you may still receive partial compensation.</p>
                <p className='sub-heading'> Getting More Bookings</p>
                <p className='howitworks-desc'>Maintain professionalism, deliver great performances, and collect positive reviews. Top-rated artists may be featured for better exposure.</p>
              </div>
            )}
            {selected === 'host' && (
              <div>
                <p className="howitworks-desc">
                  Artists showcase their talent, hosts discover performers — our platform makes meaningful musical connections happen with ease.
                  <br/>
                </p>
                <p className='sub-heading'>Finding Artists</p>
                <p className='howitworks-desc'>You can search for artists by location, genre, instrument, price, or performance type using filters. A live calendar helps confirm their availability.</p>
                
                <p className='sub-heading'>Viewing Artist Profiles</p>
                <p className='howitworks-desc'>Artist profiles include audio/video samples, bios, past gigs, reviews, and their quoted fee (“ask price”).</p>
                
                <p className='sub-heading'>Booking & Payment</p>
                <p className='howitworks-desc'>Bookings are confirmed through upfront payment, securely held by the platform until the performance is complete.</p>
                
                <p className='sub-heading'>Performance Customization</p>
                <p className='howitworks-desc'>Many artists accept custom performances and song requests, provided they’re informed in advance.</p>
                
                <p className='sub-heading'>Cancellation & Refunds</p>
                <p className='howitworks-desc'>If the artist cancels, you’ll receive either a full refund or a replacement artist. Customer-initiated cancellations follow platform policy for partial or full refunds based on notice period.</p>
              </div>
            )}
            <p className="howitworks-summary">
              Musical Meet brings artists and hosts together for unforgettable live music moments, simply and securely.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
