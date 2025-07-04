import React, { useState, useMemo, useEffect } from 'react';
import ClientForm from './ClientForm';
import ClientDetails from './ClientDetails';
import './Clients.css';

const CLIENT_TYPES = {
  ALL: 'all',
  INDIVIDUAL: 'individual',
  COMPANY: 'company'
};

const Clients = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(CLIENT_TYPES.ALL);

  useEffect(() => {
    // Load clients from localStorage
    const savedClients = JSON.parse(localStorage.getItem('clients')) || [
      {
        id: 1,
        name: 'John Smith',
        type: 'individual',
        email: 'john@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country',
        company: null,
        totalBookings: 3,
        totalSpent: 15000,
        status: 'active',
        avatar: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: 'Tech Solutions Inc.',
        type: 'company',
        email: 'info@techsolutions.com',
        phone: '+0987654321',
        address: '456 Business Ave, City, Country',
        company: 'Tech Solutions Inc.',
        totalBookings: 8,
        totalSpent: 45000,
        status: 'active',
        avatar: 'https://via.placeholder.com/150'
      }
    ];

    setClients(savedClients);
    setIsLoading(false);
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter(c => c.status === 'active').length,
      inactive: clients.filter(c => c.status === 'inactive').length,
      individual: clients.filter(c => c.type === 'individual').length,
      company: clients.filter(c => c.type === 'company').length
    };
  }, [clients]);

  // Filter clients based on selected type and search
  const filteredClients = useMemo(() => {
    let filtered = [...clients];
    
    if (selectedType !== CLIENT_TYPES.ALL) {
      filtered = filtered.filter(client => client.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query) ||
        client.company?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [clients, selectedType, searchQuery]);

  // Handlers
  const handleClientAction = (formData, action) => {
    if (action === 'add') {
      const newClient = {
        ...formData,
        id: Date.now(),
        status: 'active'
      };
      setClients([...clients, newClient]);
      localStorage.setItem('clients', JSON.stringify([...clients, newClient]));
    } else if (action === 'edit') {
      const updatedClients = clients.map(client => 
        client.id === editingClient.id ? { ...client, ...formData } : client
      );
      setClients(updatedClients);
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    }
  };

  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    }
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h1>Clients</h1>
        <div className="header-actions">
          <div className="type-filters">
            <h2>Filter by Type:</h2>
            <div className="filters-container">
              {Object.entries(CLIENT_TYPES).map(([key, value]) => (
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
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="clients-statistics">
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
          <p>Loading clients...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="empty-state">
          <p>No clients found</p>
          <button
            className="action-btn add-btn"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus"></i> Add New Client
          </button>
        </div>
      ) : (
        <div className="clients-grid">
          {filteredClients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-avatar">
                <img src={client.avatar} alt={client.name} />
              </div>
              <div className="client-info">
                <div className="client-header">
                  <div className="client-name">
                    <h3>{client.name}</h3>
                    <span className="client-type-badge">
                      {client.type === 'individual' ? 'Individual' : 'Company'}
                    </span>
                  </div>
                  <div className="client-status">
                    {client.status === 'active' ? (
                      <span className="status-badge active">Active</span>
                    ) : (
                      <span className="status-badge inactive">Inactive</span>
                    )}
                  </div>
                </div>
                <div className="client-details">
                  <div className="detail-item">
                    <i className="fas fa-envelope"></i>
                    {client.email}
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-phone"></i>
                    {client.phone}
                  </div>
                  {client.company && (
                    <div className="detail-item">
                      <i className="fas fa-building"></i>
                      {client.company}
                    </div>
                  )}
                </div>
                <div className="client-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewDetails(client)}
                  >
                    <i className="fas fa-eye"></i> View
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => handleEditClient(client)}
                  >
                    <i className="fas fa-edit"></i> Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ClientForm
          client={editingClient}
          onClose={() => {
            setShowForm(false);
            setEditingClient(null);
          }}
          onSubmit={handleClientAction}
        />
      )}

      {showDetails && selectedClient && (
        <ClientDetails
          client={selectedClient}
          onClose={() => {
            setShowDetails(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
};

export default Clients;
