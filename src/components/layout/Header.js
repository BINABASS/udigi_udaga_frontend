import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav-container">
        <div className="logo">
          <Link to="/" className="logo-link">
            Digital Brokerage
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/properties" className="nav-link">
            Properties
          </Link>
          <Link to="/bookings" className="nav-link">
            Bookings
          </Link>
          <Link to="/messaging" className="nav-link">
            Messaging
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
