import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faToggleOn, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import AccountForm from './AccountForm';
import AccountDetails from './AccountDetails';
import './AccountManagement.css';

const ACCOUNT_TYPES = {
  ALL: 'all',
  CLIENT: 'client',
  OWNER: 'owner',
  SELLER: 'seller'
};

const AccountManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(ACCOUNT_TYPES.ALL);

  useEffect(() => {
    // Load accounts from localStorage
    const savedAccounts = JSON.parse(localStorage.getItem('accounts')) || [
      {
        id: 1,
        type: 'client',
        fullName: 'John Smith',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        status: 'active',
        properties: [],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      {
        id: 2,
        type: 'owner',
        fullName: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+0987654321',
        address: '456 Business Ave, City, Country',
        status: 'active',
        properties: ['property1', 'property2'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      {
        id: 3,
        type: 'seller',
        fullName: 'Mike Brown',
        email: 'mike@example.com',
        phone: '+1122334455',
        address: '789 Market St, City, Country',
        status: 'inactive',
        properties: ['property3'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    ];

    setAccounts(savedAccounts);
    setIsLoading(false);
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    return {
      total: accounts.length,
      active: accounts.filter(a => a.status === 'active').length,
      inactive: accounts.filter(a => a.status === 'inactive').length,
      clients: accounts.filter(a => a.type === 'client').length,
      owners: accounts.filter(a => a.type === 'owner').length,
      sellers: accounts.filter(a => a.type === 'seller').length
    };
  }, [accounts]);

  // Filter accounts based on selected type and search
  const filteredAccounts = useMemo(() => {
    let filtered = [...accounts];
    
    if (selectedType !== ACCOUNT_TYPES.ALL) {
      filtered = filtered.filter(account => account.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(account => 
        account.fullName.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query) ||
        account.phone.includes(query)
      );
    }

    return filtered;
  }, [accounts, selectedType, searchQuery]);

  // Handlers
  const handleAccountAction = (formData, action) => {
    if (action === 'add') {
      const newAccount = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        properties: []
      };
      setAccounts([...accounts, newAccount]);
      localStorage.setItem('accounts', JSON.stringify([...accounts, newAccount]));
    } else if (action === 'edit') {
      const updatedAccounts = accounts.map(account => 
        account.id === editingAccount.id ? { ...account, ...formData } : account
      );
      setAccounts(updatedAccounts);
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    }
  };

  const handleDeleteAccount = (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      const updatedAccounts = accounts.filter(account => account.id !== accountId);
      setAccounts(updatedAccounts);
      localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    }
  };

  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setShowDetails(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleToggleStatus = (accountId) => {
    const updatedAccounts = accounts.map(account => 
      account.id === accountId ? {
        ...account,
        status: account.status === 'active' ? 'inactive' : 'active'
      } : account
    );
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  return (
    <div className="accounts-page">
      <div className="accounts-header">
        <h1>Account Management</h1>
        <div className="header-actions">
          <div className="type-filters">
            <h2>Filter by Type:</h2>
            <div className="filters-container">
              {Object.entries(ACCOUNT_TYPES).map(([key, value]) => (
                <button
                  key={key}
                  className={`filter-button ${selectedType === value ? 'active' : ''}`}
                  onClick={() => setSelectedType(value)}
                  data-status={key}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="accounts-statistics">
        {Object.entries(statistics).map(([key, value]) => (
          <div key={key} className="stat-card">
            <div className="stat-value">{value}</div>
            <div className="stat-label">{key}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading accounts...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="empty-state">
          <p>No accounts found</p>
          <button
            className="action-btn add-btn"
            onClick={() => setShowForm(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add New Account
          </button>
        </div>
      ) : (
        <div className="accounts-grid">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="account-card">
              <div className="account-header">
                <div className="account-info">
                  <h3>{account.fullName}</h3>
                  <span className="account-type-badge">
                    {account.type === 'client' ? 'Client' : 
                     account.type === 'owner' ? 'Property Owner' : 'Seller'}
                  </span>
                </div>
                <div className="account-status">
                  {account.status === 'active' ? (
                    <span className="status-badge active">Active</span>
                  ) : (
                    <span className="status-badge inactive">Inactive</span>
                  )}
                </div>
              </div>
              <div className="account-details">
                <div className="detail-item">
                  <i className="fas fa-envelope"></i>
                  {account.email}
                </div>
                <div className="detail-item">
                  <i className="fas fa-phone"></i>
                  {account.phone}
                </div>
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  {account.address}
                </div>
                <div className="detail-item">
                  <FontAwesomeIcon icon={faTimes} />
                  {account.properties.length} Properties
                </div>
              </div>
              <div className="account-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => handleViewDetails(account)}
                >
                  <FontAwesomeIcon icon={faEye} /> View
                </button>
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEditAccount(account)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
                <button
                  className="action-btn status-btn"
                  onClick={() => handleToggleStatus(account.id)}
                >
                  <FontAwesomeIcon icon={faToggleOn} /> {account.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AccountForm
          account={editingAccount}
          onClose={() => {
            setShowForm(false);
            setEditingAccount(null);
          }}
          onSubmit={handleAccountAction}
        />
      )}

      {showDetails && selectedAccount && (
        <AccountDetails
          account={selectedAccount}
          onClose={() => {
            setShowDetails(false);
            setSelectedAccount(null);
          }}
        />
      )}
    </div>
  );
};

export default AccountManagement;
