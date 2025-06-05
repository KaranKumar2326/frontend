import React from 'react';

const ProfilePage = () => {
  return (
    <div className="host-dashboard-page" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f7f5fc' }}>
      <div className="host-dashboard-card" style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 4px 24px rgba(108,43,217,0.08)', padding: '2.5rem 2.5rem 2rem 2.5rem', maxWidth: '700px', width: '100%', marginTop: '3rem' }}>
        <h1 style={{ color: '#6c2bd9', fontWeight: 700, fontSize: '2.2rem', marginBottom: '1.2rem' }}>Host Dashboard</h1>
        <p style={{ color: '#444', fontSize: '1.1rem', marginBottom: '2.2rem' }}>Welcome back! Here’s a quick overview of your activity and tools to manage your hosting profile.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ flex: '1 1 220px', background: '#ede7fa', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.1rem', color: '#6c2bd9', fontWeight: 600 }}>3</div>
            <div style={{ color: '#6c2bd9', fontWeight: 500, marginTop: '0.3rem' }}>Upcoming Bookings</div>
          </div>
          <div style={{ flex: '1 1 220px', background: '#ede7fa', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.1rem', color: '#6c2bd9', fontWeight: 600 }}>12</div>
            <div style={{ color: '#6c2bd9', fontWeight: 500, marginTop: '0.3rem' }}>Past Events Hosted</div>
          </div>
          <div style={{ flex: '1 1 220px', background: '#ede7fa', borderRadius: '12px', padding: '1.2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.1rem', color: '#6c2bd9', fontWeight: 600 }}>4.8</div>
            <div style={{ color: '#6c2bd9', fontWeight: 500, marginTop: '0.3rem' }}>Avg. Rating</div>
          </div>
        </div>
        <div style={{ marginBottom: '2.2rem' }}>
          <h2 style={{ color: '#6c2bd9', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.7rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button style={{ background: '#6c2bd9', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Create New Event</button>
            <button style={{ background: '#fff', color: '#6c2bd9', border: '2px solid #6c2bd9', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>Edit Profile</button>
            <button style={{ background: '#fff', color: '#6c2bd9', border: '2px solid #6c2bd9', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>View Bookings</button>
          </div>
        </div>
        <div>
          <h2 style={{ color: '#6c2bd9', fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.7rem' }}>Recent Activity</h2>
          <ul style={{ color: '#444', fontSize: '1rem', paddingLeft: '1.2rem', margin: 0 }}>
            <li>Booking confirmed for "Jazz Night" on June 10</li>
            <li>Received a 5-star review from artist "The Blue Notes"</li>
            <li>Updated venue details</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;