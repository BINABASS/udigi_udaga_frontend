import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <h1>Contact Us</h1>
        <div className="contact-sections">
          <div className="section">
            <div className="section-icon">
              <i className="fas fa-home"></i>
            </div>
            <div className="section-content">
              <h2>Property Management</h2>
              <p>Effortlessly manage your property portfolio</p>
            </div>
          </div>
          <div className="section">
            <div className="section-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="section-content">
              <h2>Client Management</h2>
              <p>Track and manage client interactions</p>
            </div>
          </div>
          <div className="section">
            <div className="section-icon">
              <i className="fas fa-calendar"></i>
            </div>
            <div className="section-content">
              <h2>Booking System</h2>
              <p>Streamline your booking process</p>
            </div>
          </div>
        </div>
        <div className="contact-actions">
          <Link to="/login" className="admin-login-btn">
            <i className="fas fa-user-shield"></i> Admin Login
          </Link>
          <Link to="/" className="back-btn">
            <i className="fas fa-home"></i> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
