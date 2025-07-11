import React, { useState } from 'react';
import './HowItWorksPage.css';
import NavigationBar from './NavigationBar';
import Footer from './HomePage/Footer';


const HowItWorksPage = () => {
  const [selected, setSelected] = useState('artist');
  const [openIndexes, setOpenIndexes] = useState({});

  const accordionData = {
    artist: [
      {
        question: 'How do I set up my profile?',
        answer: 'Showcase your musical expertise with a comprehensive profile featuring your bio, sample performances, pricing, and availability.'
      },
      {
        question: 'How do I gain visibility?',
        answer: 'Get discovered by users seeking live music for private events in your local area.'
      },
      {
        question: 'How do I accept and manage bookings?',
        answer: 'Receive booking requests directly through the platform. Upon accepting, the payment is processed securely and the performance is confirmed.'
      },
      {
        question: 'How do I organise jamming sessions?',
        answer: 'Host public or exclusive jamming sessions to engage with audiences, experiment creatively, and generate additional income.'
      },
      {
        question: 'How do I build my reputation?',
        answer: 'Enhance your professional network, gather reviews, and increase your visibility by consistently delivering high-quality performances.'
      },
    ],
    host: [
      {
        question: 'How do I engage professional artists for my event?',
        answer: 'Engage professional artists to elevate your private events with live performances and discover unique musical experiences.'
      },
      {
        question: 'How do I explore local talent?',
        answer: 'Browse a curated selection of verified singers, musicians, and performers available in your city.'
      },
      {
        question: 'How do I review artist profiles?',
        answer: 'View detailed profiles, including performance samples, pricing, availability, and client feedback to make an informed decision.'
      },
      {
        question: 'How do I secure a booking?',
        answer: 'Submit a booking request by paying the artist’s listed rate. Once the artist confirms, the performance is officially scheduled.'
      },
      {
        question: 'What are jamming sessions?',
        answer: 'Participate in artist-led jamming sessions—an excellent opportunity to enjoy live music in an intimate setting and connect with emerging talent.'
      },
    ]
  };

  const handleAccordionClick = (idx) => {
    setOpenIndexes(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #fff 60%, #f3eafd 100%)',
    }}>
      <NavigationBar />
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '3rem',
        fontWeight: 800,
        color: '#444',
        margin: '2.5rem 0 1.5rem 0',
        textAlign: 'center',
        letterSpacing: '0.5px',
      }}>About Us</h1>
      <div className="aboutus-flex-container" style={{
        width: '100%',
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        gap: '0',
        padding: '0 0 1.2rem 0',
        minHeight: '260px',
        background: 'none',
        boxShadow: '0 8px 40px 0 rgba(108,43,217,0.22)',
        borderRadius: '20px',
      }}>
        <div className="aboutus-image-section" style={{
          flex: '1.5 1 420px',
          minWidth: '320px',
          background: 'linear-gradient(135deg, #e6d6fa 60%, #cbb6f7 100%)',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
          borderTopLeftRadius: '18px',
          borderBottomLeftRadius: '18px',
          borderTopRightRadius: '0',
          borderBottomRightRadius: '0',
          overflow: 'hidden',
        }}>
          <img src="/bg2.jpg" alt="About Us" style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 0,
            boxShadow: '0 2px 12px rgba(108,43,217,0.08)',
            display: 'block',
            minHeight: 0,
          }} />
        </div>
        <div className="aboutus-text-section" style={{
          flex: '2 1 400px',
          minWidth: 0,
          background: 'linear-gradient(135deg, #f9f7fd 60%, #e6d6fa 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderTopRightRadius: '18px',
          borderBottomRightRadius: '18px',
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
          padding: '2.2rem 2rem',
        }}>
          {/* About Us heading moved above the container */}
          <p style={{
            maxWidth: 700,
            margin: '1.1rem auto 0 auto',
            color: '#3f2a6b',
            fontSize: '1.18rem',
            fontFamily: 'Montserrat, Arial, Helvetica, sans-serif',
            textAlign: 'center',
            fontWeight: 500,
            lineHeight: 1.6,
            background: 'none',
            borderRadius: '12px',
            padding: 0,
            boxShadow: 'none',
          }}>
            <span style={{ fontWeight: 700, color: '#6c2bd9' }}>Built for music lovers, by music lovers.</span><br /><br />
            Musical Meet connects talented artists, passionate music lovers, and event hosts. Whether you're a performer looking to showcase your skills or a host searching for the perfect live act, our app makes it easy and inspiring to connect, book, and create memorable moments.<br /><br />
            <span style={{ color: '#6c2bd9', fontWeight: 600 }}>For Artists:</span> Share your music, reach new audiences, and get booked for events and sessions.<br />
            <span style={{ color: '#6c2bd9', fontWeight: 600 }}>For Hosts & Fans:</span> Discover and book verified musicians and performers for your events, parties, or gatherings.<br /><br />
            Join Musical Meet and be part of a community where creativity and connection are at the heart of every note.
          </p>
        </div>
      </div>
      <div className="howitworks-main">
        <div className="howitworks-options-container">
          <div style={{ width: '100%' }}>
            <h1 className="howitworks-title">How It Works</h1>
          </div>
          <div className="howitworks-options-row">
            <div
              className={`howitworks-option${selected === 'artist' ? ' selected' : ''}`}
              onClick={() => setSelected('artist')}
            >
              <div className="howitworks-option-inner">
                <h2 className="howitworks-option-title">For Artists</h2>
              </div>
            </div>
            <div
              className={`howitworks-option${selected === 'host' ? ' selected' : ''}`}
              onClick={() => setSelected('host')}
            >
              <div className="howitworks-option-inner">
                <h2 className="howitworks-option-title">For Hosts</h2>
              </div>
            </div>
          </div>

          <div style={{ width: '100%' }}>
            {accordionData[selected].map((item, idx) => (
              <div key={idx} style={{ marginBottom: '1.2rem', boxShadow: '0 1px 4px rgba(108,43,217,0.04)', background: '#f9f7fd', borderRadius: '10px', transition: 'border-radius 0.3s' }}>
                <div style={{ padding: '0 1.2rem' }}>
                  <button
                    className="sub-heading"
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      padding: '1.2rem 0 1.2rem 0',
                      cursor: 'pointer',
                      color: '#6c2bd9',
                      borderBottom: openIndexes[idx] ? '1px solid #e0d7fa' : '1px solid transparent',
                      transition: 'background 0.2s',
                      letterSpacing: '0.2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                    }}
                    onClick={() => handleAccordionClick(idx)}
                    aria-expanded={!!openIndexes[idx]}
                  >
                    <span>{item.question}</span>
                    <span
                      className={`howitworks-arrow${openIndexes[idx] ? ' open' : ''}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginLeft: 'auto',
                        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
                        transform: openIndexes[idx] ? 'rotate(180deg)' : 'rotate(0deg)',
                        fontSize: '1.5em',
                        color: '#6c2bd9',
                        userSelect: 'none',
                      }}
                      aria-hidden="true"
                    >
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L11 14L16 9" stroke="#6c2bd9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`howitworks-answer howitworks-desc-animated${openIndexes[idx] ? ' open' : ''}`}
                    style={{ padding: '0 0 1.2rem 0', borderRadius: '0 0 10px 10px' }}
                  >
                    {openIndexes[idx] && item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
