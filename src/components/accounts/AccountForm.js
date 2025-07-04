import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck, faEnvelope, faPhone, faMapMarkerAlt, faHome, faCalendar, faLock, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import './AccountManagement.css';

const AccountForm = ({ account, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: account?.fullName || '',
    type: account?.type || 'client',
    email: account?.email || '',
    phone: account?.phone || '',
    address: account?.address || '',
    status: account?.status || 'active',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    identificationNumber: '',
    identificationType: 'id_card',
    properties: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, account ? 'edit' : 'add');
    onClose();
  };

  return (
    <div className="account-form-modal">
      <div className="account-form">
        <h2>{account ? 'Edit Account' : 'Add New Account'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="type">Account Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="input-with-icon"
            >
              <option value="client">Client</option>
              <option value="owner">Property Owner</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <div className="input-with-icon">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <div className="input-with-icon">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
              <FontAwesomeIcon icon={faPhone} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter address"
              />
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="input-with-icon"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Additional Fields */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
              <FontAwesomeIcon icon={faLock} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <div className="input-with-icon">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
              />
              <FontAwesomeIcon icon={faCheck} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth:</label>
            <div className="input-with-icon">
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
              <FontAwesomeIcon icon={faCalendar} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="identificationType">ID Type:</label>
            <select
              id="identificationType"
              name="identificationType"
              value={formData.identificationType}
              onChange={handleChange}
              required
              className="input-with-icon"
            >
              <option value="id_card">ID Card</option>
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver's License</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="identificationNumber">ID Number:</label>
            <div className="input-with-icon">
              <input
                type="text"
                id="identificationNumber"
                name="identificationNumber"
                value={formData.identificationNumber}
                onChange={handleChange}
                required
                placeholder="Enter ID number"
              />
              <FontAwesomeIcon icon={faHome} />
            </div>
          </div>

          <div className="form-actions">
            <div className="form-note">
              <FontAwesomeIcon icon={faInfoCircle} /> Required fields are marked with *
            </div>
            <button
              type="button"
              className="action-btn cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="action-btn submit-btn"
            >
              {account ? 'Update' : 'Add'} Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
