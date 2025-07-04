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
    // Mock data for testing
    const mockProperties = [
      {
        id: 1,
        title: 'Luxury Villa',
        type: 'Villa',
        location: 'Downtown',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        price: 5000,
        bookingDate: '2025-07-10',
        clientName: 'John Doe',
        duration: 6,
        image: 'https://via.placeholder.com/400x300',
        status: 'Booked'
      },
      {
        id: 2,
        title: 'Modern Apartment',
        type: 'Apartment',
        location: 'Beachside',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        price: 2500,
        bookingDate: '2025-07-15',
        clientName: 'Jane Smith',
        duration: 3,
        image: 'https://via.placeholder.com/400x300',
        status: 'Booked'
      },
      {
        id: 3,
        title: 'Family House',
        type: 'House',
        location: 'Suburbs',
        bedrooms: 5,
        bathrooms: 4,
        area: 3000,
        price: 6500,
        bookingDate: '2025-06-20',
        clientName: 'Robert Johnson',
        duration: 12,
        image: 'https://via.placeholder.com/400x300',
        status: 'Booked'
      }
    ];

    setProperties(mockProperties);
    setIsLoading(false);
  }, []);

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
          localStorage.setItem('properties', JSON.stringify(updatedProperties));
          setProperties(updatedProperties);
        }
        break;
      case 'mark-complete':
        const updatedProperty = {
          ...property,
          status: 'Completed',
          completedDate: new Date().toISOString()
        };
        const updatedProperties = properties.map(p => 
          p.id === property.id ? updatedProperty : p
        );
        localStorage.setItem('properties', JSON.stringify(updatedProperties));
        setProperties(updatedProperties);
        break;
      case 'extend':
        setShowForm(true);
        setEditingProperty({
          ...property,
          action: 'extend'
        });
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
    <div className="booking-page">
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookings...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-box-open"></i>
          <h2>No Bookings Found</h2>
          <p>Start by adding some booked properties.</p>
        </div>
      ) : (
        <>
          <div className="booking-header">
            <div className="header-actions">
              <div className="header-stats">
                <div className="stat-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <span className="stat-value">{properties.length}</span>
                    <span className="stat-label">Total Bookings</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-calendar-check"></i>
                  <div>
                    <span className="stat-value">{properties.filter(p => new Date(p.bookingDate) > new Date()).length}</span>
                    <span className="stat-label">Upcoming Bookings</span>
                  </div>
                </div>
                <div className="stat-item">
                  <i className="fas fa-calendar-times"></i>
                  <div>
                    <span className="stat-value">{properties.filter(p => {
                      const endDate = new Date(new Date(p.bookingDate).setMonth(
                        new Date(p.bookingDate).getMonth() + p.duration
                      ));
                      return endDate < new Date();
                    }).length}</span>
                    <span className="stat-label">Completed Bookings</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="booking-filters">
              <div className="filter-group">
                <label>Status</label>
                <select 
                  className="type-filter" 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value={BOOKING_STATUSES.ALL}>All Bookings</option>
                  <option value={BOOKING_STATUSES.UPCOMING}>Upcoming</option>
                  <option value={BOOKING_STATUSES.COMPLETED}>Completed</option>
                  <option value={BOOKING_STATUSES.OVERDUE}>Overdue</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Search</label>
                <div className="search-container">
                  <i className="fas fa-search"></i>
                  <input 
                    type="text" 
                    placeholder="Search properties..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="booking-grid">
            {sortedProperties.map((property) => {
              const bookingDate = new Date(property.bookingDate);
              const endDate = new Date(bookingDate);
              endDate.setMonth(endDate.getMonth() + property.duration);
              const isOverdue = bookingDate < new Date() && endDate > new Date();
              const isCompleted = endDate < new Date();
              
              return (
                <div 
                  key={property.id} 
                  className={`booking-card ${isOverdue ? 'overdue' : isCompleted ? 'completed' : ''}`}
                >
                  <div className="booking-image">
                    <img src={property.image} alt={property.title} />
                    <div className="booking-overlay">
                      <div className="overlay-content">
                        <h3>{property.title}</h3>
                        <p className="overlay-price">${property.price.toLocaleString()}</p>
                        <button className="quick-view-btn" onClick={() => handleViewDetails(property)}>
                          <i className="fas fa-search"></i> Quick View
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="booking-info">
                    <div className="property-meta">
                      <span className="property-type">{property.type}</span>
                      <span className="property-location">{property.location}</span>
                    </div>
                    <div className="booking-details">
                      <div className="detail-item">
                        <i className="fas fa-bed"></i>
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-bath"></i>
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="detail-item">
                        <i className="fas fa-ruler-combined"></i>
                        <span>{property.area} sqft</span>
                      </div>
                      <div className="booking-info-item">
                        <i className="fas fa-calendar"></i>
                        <span>Booked: {bookingDate.toLocaleDateString()}</span>
                      </div>
                      <div className="booking-info-item">
                        <i className="fas fa-user"></i>
                        <span>Client: {property.clientName}</span>
                      </div>
                      <div className="booking-info-item">
                        <i className="fas fa-clock"></i>
                        <span>Duration: {property.duration} months</span>
                      </div>
                      <div className="booking-info-item">
                        <i className="fas fa-calendar-alt"></i>
                        <span>End Date: {endDate.toLocaleDateString()}</span>
                      </div>
                      {isOverdue && (
                        <div className="booking-info-item overdue-notice">
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>Overdue Booking</span>
                        </div>
                      )}
                    </div>
                    <div className="property-price">
                      <span className="price-label">Price:</span>
                      <span className="price-value">${property.price.toLocaleString()}</span>
                    </div>
                    <div className="booking-actions">
                      <button className="action-btn view-btn" onClick={() => handleViewDetails(property)}>
                        <i className="fas fa-eye"></i> View Details
                      </button>
                      <button className="action-btn edit-btn" onClick={() => handlePropertyAction(property, 'edit')}>
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      {!isCompleted && (
                        <button 
                          className="action-btn extend-btn" 
                          onClick={() => handlePropertyAction(property, 'extend')}
                        >
                          <i className="fas fa-clock"></i> Extend
                        </button>
                      )}
                      <button className="action-btn delete-btn" onClick={() => handlePropertyAction(property, 'delete')}>
                        <i className="fas fa-trash"></i> Delete
                      </button>
                      {isOverdue && (
                        <button 
                          className="action-btn complete-btn" 
                          onClick={() => handlePropertyAction(property, 'mark-complete')}
                        >
                          <i className="fas fa-check"></i> Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
      )}
    </div>
  );
};

export default Booking;
