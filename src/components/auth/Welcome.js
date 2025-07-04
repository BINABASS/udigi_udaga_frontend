import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Digital Brokerage</h1>
        <p className="welcome-subtitle">Your trusted real estate management platform</p>
        
        <div className="welcome-features">
          <div className="feature-card">
            <div className="feature-icon">🏠</div>
            <h3>Property Management</h3>
            <p>Effortlessly manage your property portfolio</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Client Management</h3>
            <p>Track and manage client interactions</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Booking System</h3>
            <p>Streamline your booking process</p>
          </div>
        </div>

        <div className="welcome-buttons">
          <Link to="/login" className="cta-button primary">Admin Login</Link>
          <Link to="/contact" className="cta-button secondary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
