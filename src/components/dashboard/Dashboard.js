import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Digital Brokerage</h1>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" className="nav-link">
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/properties" className="nav-link">
                <i className="fas fa-home"></i>
                <span>Properties</span>
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="nav-link">
                <i className="fas fa-calendar"></i>
                <span>Bookings</span>
              </Link>
            </li>
            <li>
              <Link to="/clients" className="nav-link">
                <i className="fas fa-users"></i>
                <span>Clients</span>
              </Link>
            </li>
            <li>
              <Link to="/messages" className="nav-link">
                <i className="fas fa-envelope"></i>
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link to="/reports" className="nav-link">
                <i className="fas fa-chart-bar"></i>
                <span>Reports</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="main-content">
        <div className="header">
          <div className="welcome">
            <h2>Dashboard</h2>
            <p>Admin</p>
          </div>
          <div className="user-actions">
            <Link to="/login" className="logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </Link>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Properties</h3>
            <p>125</p>
            <span className="trend up">+15%</span>
          </div>
          <div className="stat-card">
            <h3>Active Bookings</h3>
            <p>42</p>
            <span className="trend up">+8%</span>
          </div>
          <div className="stat-card">
            <h3>New Clients</h3>
            <p>35</p>
            <span className="trend up">+12%</span>
          </div>
          <div className="stat-card">
            <h3>Messages</h3>
            <p>18</p>
            <span className="trend down">-5%</span>
          </div>
        </div>
        <div className="charts-section">
          <h3>Recent Activity</h3>
          <div className="chart-container">
            {/* Chart placeholder */}
            <div className="chart-placeholder">
              Property Distribution
            </div>
          </div>
          <div className="chart-container">
            <h3>Property Distribution</h3>
            <div className="chart-placeholder">
              {/* Chart will be added here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
