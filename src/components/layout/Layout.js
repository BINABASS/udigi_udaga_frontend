import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/dashboard', icon: 'fas fa-chart-line', text: 'Dashboard' },
    { path: '/properties', icon: 'fas fa-home', text: 'Properties' },
    { path: '/dashboard/booking', icon: 'fas fa-calendar', text: 'Bookings' },
    { path: '/clients', icon: 'fas fa-users', text: 'Clients' },
    { path: '/messages', icon: 'fas fa-envelope', text: 'Messages' },
    { path: '/reports', icon: 'fas fa-chart-bar', text: 'Reports' },
    { path: '/contact', icon: 'fas fa-phone', text: 'Contact' },
  ];

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Digital Brokerage</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${currentPath.startsWith(item.path) ? 'active' : ''}`}
                >
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <Link to="/login" className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </Link>
        </div>
      </div>
      <div className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
