import React, { useState, useMemo, useEffect } from 'react';
import PropertyForm from '../properties/PropertyForm';
import PropertyDetails from '../properties/PropertyDetails';
import './Booking.css';

const BOOKING_STATUSES = {
  ALL: 'all',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  OVERDUE: 'overdue'
};

const Booking = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(BOOKING_STATUSES.ALL);

  useEffect(() => {
    // Load properties from localStorage
    const savedProperties = JSON.parse(localStorage.getItem('properties')) || [];
    
    // Add booking-specific fields to properties
    const propertiesWithBookings = savedProperties.map(property => ({
      ...property,
      bookingDate: property.bookingDate || new Date().toISOString().split('T')[0],
      clientName: property.clientName || 'Client Name',
      duration: property.duration || 12,
      status: property.status || 'Booked'
    }));

    setProperties(propertiesWithBookings);
    setIsLoading(false);
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    const today = new Date();
    return {
      total: properties.length,
      upcoming: properties.filter(p => new Date(p.bookingDate) > today).length,
      completed: properties.filter(p => {
        const endDate = new Date(p.bookingDate);
        endDate.setMonth(endDate.getMonth() + p.duration);
        return endDate < today;
      }).length,
      overdue: properties.filter(p => {
        const bookingDate = new Date(p.bookingDate);
        const endDate = new Date(bookingDate);
        endDate.setMonth(endDate.getMonth() + p.duration);
        return bookingDate < today && endDate > today;
      }).length
    };
  }, [properties]);

  // Filter properties based on selected status and date range
  const filteredProperties = useMemo(() => {
    let filtered = [...properties];
    
    // Apply status filter
    if (selectedStatus !== BOOKING_STATUSES.ALL) {
      const today = new Date();
      filtered = filtered.filter(property => {
        const bookingDate = new Date(property.bookingDate);
        const endDate = new Date(bookingDate);
        endDate.setMonth(endDate.getMonth() + property.duration);
        
        switch (selectedStatus) {
          case BOOKING_STATUSES.UPCOMING:
            return bookingDate > today;
          case BOOKING_STATUSES.COMPLETED:
            return endDate < today;
          case BOOKING_STATUSES.OVERDUE:
            return bookingDate < today && endDate > today;
          default:
            return true;
        }
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.location.toLowerCase().includes(query) ||
        property.clientName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [properties, selectedStatus, searchQuery]);

  // Handle booking actions
  const handleExtendBooking = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      // Update property duration
      property.duration += 1; // Extend by 1 month
      setProperties(prev => prev.map(p => 
        p.id === propertyId ? { ...p, duration: property.duration } : p
      ));
    }
  };

  const handleMarkComplete = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      // Update property status
      property.status = 'Completed';
      setProperties(prev => prev.map(p => 
        p.id === propertyId ? { ...p, status: 'Completed' } : p
      ));
    }
  };

  // Sort properties by booking date (newest first)
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      const dateA = new Date(a.bookingDate || '2023-01-01');
      const dateB = new Date(b.bookingDate || '2023-01-01');
      return dateB - dateA;
    });
  }, [filteredProperties]);

  const handlePropertyAction = (property, action) => {
    switch (action) {
      case 'edit':
        setEditingProperty(property);
        setShowForm(true);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${property.title}?`)) {
          const updatedProperties = properties.filter(p => p.id !== property.id);
          setProperties(updatedProperties);
        }
        break;
      case 'mark-complete':
        handleMarkComplete(property.id);
        break;
      case 'extend':
        handleExtendBooking(property.id);
        break;
      default:
        break;
    }
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetails(true);
  };

  return (
    <>
      <div className="booking-page">
        <div className="booking-header">
          <div className="header-content">
            <h1>Bookings</h1>
            <div className="header-actions">
              <div className="status-filters">
                <h2>Filter by Status:</h2>
                <div className="filters-container">
                  {Object.entries(BOOKING_STATUSES).map(([key, value]) => (
                    <button
                      key={key}
                      className={`filter-button ${selectedStatus === value ? 'active' : ''}`}
                      onClick={() => setSelectedStatus(value)}
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
                  placeholder="Search by title, location, or client name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="booking-statistics">
            {Object.entries(statistics).map(([key, value]) => (
              <div key={key} className="stat-card">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{key}</div>
              </div>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading bookings...</p>
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="empty-state">
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="bookings-grid">
            {sortedProperties.map((property) => (
              <div key={property.id} className="booking-card">
                <div className="booking-content">
                  <div className="booking-image">
                    <img src={property.image} alt={property.title} />
                  </div>
                  <div className="booking-details">
                    <h2 className="booking-title">{property.title}</h2>
                    <div className="booking-info">
                      <div className="booking-info-item">
                        <i className="fas fa-map-marker-alt"></i>
                        {property.location}
                      </div>
                      <div className="booking-info-item">
                        <i className="fas fa-calendar"></i>
                        {property.bookingDate}
                      </div>
                      <div className="booking-info-item">
                        <i className="fas fa-user"></i>
                        {property.clientName}
                      </div>
                      <div className="booking-info-item">
                        <i className="fas fa-clock"></i>
                        {property.duration} months
                      </div>
                    </div>
                    <div className="booking-actions">
                      <button
                        className="action-button view-button"
                        onClick={() => handleViewDetails(property)}
                      >
                        <i className="fas fa-eye"></i>
                        View
                      </button>
                      <button
                        className="action-button edit-button"
                        onClick={() => handlePropertyAction(property, 'edit')}
                      >
                        <i className="fas fa-edit"></i>
                        Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handlePropertyAction(property, 'delete')}
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                      <button
                        className="action-button extend-button"
                        onClick={() => handlePropertyAction(property, 'extend')}
                      >
                        <i className="fas fa-clock"></i>
                        Extend
                      </button>
                      <button
                        className="action-button mark-complete-button"
                        onClick={() => handlePropertyAction(property, 'mark-complete')}
                      >
                        <i className="fas fa-check"></i>
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <PropertyForm
          property={editingProperty}
          onClose={() => {
            setShowForm(false);
            setEditingProperty(null);
          }}
          onSubmit={handlePropertyAction}
        />
      )}

      {showDetails && selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => {
            setShowDetails(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </>
  );
};

export default Booking;
