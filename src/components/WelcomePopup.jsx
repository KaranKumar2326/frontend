
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePopup.module.css';

// Add new prop: incompleteFields (array of { field, completed })
const fieldLabels = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  stageName: 'Stage Name',
  description: 'Description',
  preferredLocation: 'Preferred Location',
  pricing: 'Pricing',
  imageUrl: 'Profile Image',
  genres: 'Genres',
  instruments: 'Instruments',
  coverImage: 'Cover Image',
  exp: 'Experience',
  securityQuestions: 'Security Questions',
};

const WelcomePopup = ({ open, onClose, instructionMsg, artistId, isUser, incompleteFields }) => {
  const [visible, setVisible] = React.useState(false);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [open]);

  // Always show checklist if isUser and incompleteFields is an array (even if empty)
  const showChecklist = (
    (isUser && Array.isArray(incompleteFields)) ||
    (Array.isArray(incompleteFields) && incompleteFields.length > 0)
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  if (!open && !visible) return null;
  // App's main purple: #6c2bd9, yellow: #f0e11a, font: inherit or 'Poppins', sans-serif
  const shortInstruction = isUser
    ? 'Complete your profile to book artists and join sessions.'
    : 'Complete your artist profile to get discovered!';
  
  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .welcome-popup-responsive {
            margin-top: 0.3rem !important;
            padding-top: 0.9rem !important;
            max-height: 500px !important;
            overflow-y: auto !important;
            width: 300px !important;
            max-width: 98vw !important;
          }
          .welcome-popup-responsive h2 {
            font-size: 0.9rem !important;
          }
        }
        @media (max-width: 600px) {
          .welcome-popup-responsive .profile-checklist {
            font-size: 0.78rem !important;
          }
          .welcome-popup-responsive .profile-checklist-title {
            font-size: 0.89rem !important;
          }
          .welcome-popup-responsive .profile-checklist-badge {
            padding: 3px 7px !important;
            font-size: 0.78rem !important;
            min-width: 46px !important;
          }
          .welcome-popup-responsive .profile-checklist-badge span:last-child {
            font-size: 0.78rem !important;
          }
          .welcome-popup-responsive .profile-checklist-badge .profile-checklist-sign {
            display: none !important;
          }
        }
        .welcome-popup-responsive .instruction-message {
          font-size: 0.95rem !important;
          padding: 0.8rem 0.9rem !important;
        }
@media (min-width: 601px) {
  .welcome-popup-responsive .go-to-profile-btn {
    padding: 16px 48px !important;
    font-size: 1.25rem !important;
  }
}
      `}</style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: open ? 'auto' : 'none',
      }}>
      {/* Blur effect overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 2001,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(7px)',
          WebkitBackdropFilter: 'blur(7px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.5s',
        }}
      />
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          maxWidth: '98vw',
          width: '900px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          textAlign: 'center',
          position: 'fixed',
          zIndex: 2002,
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.5s, transform 0.5s',
          fontFamily: 'inherit, Poppins, sans-serif',
        }}
        className="welcome-popup-responsive"
      >
        <h2 style={{ color: '#6c2bd9', fontWeight: 800, fontSize: '2.2rem', marginBottom: '1.1rem', fontFamily: 'inherit, Poppins, sans-serif', letterSpacing: '0.5px' }}>
          Welcome to Musical Meet!
        </h2>
        {instructionMsg ? (
          <>
            <p className="instruction-message" style={{
              color: '#6c2bd9',
              fontSize: '1.18rem',
              marginBottom: '0.3rem',
              fontFamily: 'inherit, Poppins, sans-serif',
              lineHeight: 1.7,
              fontWeight: 500,
              background: 'rgba(108,43,217,0.07)',
              borderRadius: '12px',
              padding: '1rem 1.2rem',
              display: 'inline-block',
              boxShadow: '0 2px 8px rgba(108,43,217,0.07)'
            }}>
              {isMobile ? (
                <>
                  {shortInstruction}
                </>
              ) : (
                isUser ? (
                  <>
                    Please complete your profile so you can book artists, join jamming sessions, and connect with the community!<br/>
                    <span style={{color:'#222', fontWeight:400}}>{instructionMsg}</span>
                  </>
                ) : (
                  <>
                    Please complete your artist profile so fans and event organizers can discover you!<br/>
                    <span style={{color:'#222', fontWeight:400}}>{instructionMsg}</span>
                  </>
                )
              )}
            </p>
            {/* Show completion status for each required field (artist or user) */}
            {showChecklist && (
              <div className="profile-checklist" style={{
                margin: '1.2rem auto 0.3rem auto',
                maxWidth: 600,
                background: '#f8f6ff',
                borderRadius: 16,
                padding: '1.1rem 1.2rem',
                boxShadow: '0 2px 8px rgba(108,43,217,0.07)',
                textAlign: 'left',
                fontSize: '0.97rem',
                fontFamily: 'inherit, Poppins, sans-serif',
              }}>
                <div className="profile-checklist-title" style={{fontWeight:600, color:'#6c2bd9', marginBottom:12, fontSize:'1.13rem'}}>
                  Profile Completion Checklist:
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px 14px',
                  alignItems: 'center',
                }}>
                  {Array.isArray(incompleteFields) && incompleteFields.length > 0 ? (
                    incompleteFields.map(({ field, completed }) => (
                      <span key={field} className="profile-checklist-badge" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: completed ? '#eafbe7' : '#fff0f0',
                        border: completed ? '1.5px solid #2ecc40' : '1.5px solid #d7263d',
                        color: completed ? '#1e7d3a' : '#b91c1c',
                        borderRadius: 20,
                        padding: '6px 16px',
                        fontWeight: completed ? 600 : 700,
                        fontSize: '1.07rem',
                        minWidth: 90,
                        boxShadow: completed ? '0 1px 4px #eafbe7' : '0 1px 4px #fff0f0',
                        transition: 'all 0.2s',
                      }}>
                        <span className="profile-checklist-sign" style={{fontSize:'1.15em', marginRight:7}}>{completed ? '✔️' : '✖️'}</span>
                        <span>{fieldLabels[field] || field}</span>
                      </span>
                    ))
                  ) : (
                    <span style={{color:'#b91c1c', fontWeight:600}}>No required fields found.</span>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{
            color: '#222',
            fontSize: '1.25rem',
            marginBottom: '1.2rem',
            fontFamily: 'inherit, Poppins, sans-serif',
            lineHeight: 1.6,
          }}>
            <span style={{ fontWeight: 600, color: '#6c2bd9', fontSize: '1.3rem' }}>Unite. Create. Celebrate.</span><br /><br />
            <span style={{ fontWeight: 500 }}>
              Step into a world where music knows no boundaries! <br />
              <span style={{ color: '#6c2bd9', fontWeight: 700 }}>Musical Meet</span> is your gateway to discovering incredible artists, booking unforgettable performances, and joining vibrant jamming sessions—whether you're a fan, a performer, or an event organizer.<br /><br />
              <span style={{ color: '#6c2bd9', fontWeight: 600 }}>Why you'll love us:</span>
            </span>
            <ul style={{
              textAlign: 'left',
              margin: '1.1rem 0 1.5rem 1.2rem',
              color: '#444',
              fontSize: '1.08rem',
              fontFamily: 'inherit, Poppins, sans-serif',
              lineHeight: 1.7,
              fontWeight: 400,
            }}>
              <li><span style={{fontWeight:600}}>🎤 Hire</span> top artists for your private or public events</li>
              <li><span style={{fontWeight:600}}>🎸 Join</span> as an artist and grow your audience</li>
              <li><span style={{fontWeight:600}}>🤝 Jam</span> with musicians in public or private sessions</li>
              <li><span style={{fontWeight:600}}>🌟 Explore</span> trending and featured talent</li>
              <li><span style={{fontWeight:600}}>🖼️ Relive</span> magical moments in our gallery</li>
            </ul>
            <span style={{ fontWeight: 500 }}>
              Ready to make music memories? <span style={{ color: '#6c2bd9', fontWeight: 700 }}>Start your journey now!</span>
            </span>
          </p>
        )}
        {/* Show button depending on context: if artistId is present, show Go to Profile Page, else show Get Started (for homepage/user) */}
        {artistId ? (
          <button
            onClick={() => {
              navigate(`/publicartistprofilepage/${artistId}`);
              onClose && onClose();
            }}
            className="go-to-profile-btn"
            style={{
              background: '#6c2bd9',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '8px 22px',
              fontWeight: 700,
              fontSize: '0.98rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              boxShadow: '0 2px 8px rgba(108,43,217,0.12)',
              fontFamily: 'inherit, Poppins, sans-serif',
              letterSpacing: '0.5px',
              outline: 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            Go to Profile Page
          </button>
        ) : (
          <button
            onClick={() => {
              if (isUser) {
                const userId = localStorage.getItem('user_id');
                if (userId) {
                  navigate(`/profilepage/${userId}`);
                } else {
                  navigate('/profilepage'); // fallback if no id
                }
                onClose && onClose();
              } else {
                onClose && onClose();
              }
            }}
            style={{
              background: '#6c2bd9',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '12px 36px',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              marginTop: '0.5rem',
              boxShadow: '0 2px 8px rgba(108,43,217,0.12)',
              fontFamily: 'inherit, Poppins, sans-serif',
              letterSpacing: '0.5px',
              outline: 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            {isUser ? 'Go to Profile' : 'Get Started'}
          </button>
        )}
      </div>
    </div>
    </>
  );
};
        
export default WelcomePopup;
