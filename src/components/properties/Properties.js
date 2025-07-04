import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropertyForm from './PropertyForm';
import PropertyDetails from './PropertyDetails';
import './Properties.css';

const amenityIcons = {
  'pool': 'fa-swimming-pool',
  'garden': 'fa-tree',
  'security': 'fa-shield-alt',
  'parking': 'fa-parking',
  'wifi': 'fa-wifi',
  'gym': 'fa-dumbbell',
  'balcony': 'fa-window-maximize',
  'pet friendly': 'fa-paw',
  'ac': 'fa-snowflake',
  'laundry': 'fa-tshirt',
  'kitchen': 'fa-utensils'
};

const getAmenityIcon = (amenity) => {
  const key = amenity.toLowerCase().replace(/\s+/g, '');
  return amenityIcons[key] || 'fa-star';
};

const Properties = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState(() => {
    const savedProperties = JSON.parse(localStorage.getItem('properties')) || [
      {
        id: 1,
        title: 'Luxury Villa in City Center',
        type: 'Villa',
        status: 'Available',
        price: 750000,
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        location: 'Downtown',
        amenities: ['pool', 'garden', 'security'],
        description: 'Luxurious villa with stunning city views and modern amenities.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      },
      {
        id: 2,
        title: 'Modern Apartment with View',
        type: 'Apartment',
        status: 'Booked',
        price: 350000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        location: 'Suburbs',
        amenities: ['wifi', 'parking'],
        description: 'Sleek modern apartment with beautiful city views.',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      },
      {
        id: 3,
        title: 'Cozy Family Home',
        type: 'House',
        status: 'Available',
        price: 550000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        location: 'Residential',
        amenities: ['garden', 'parking', 'wifi'],
        description: 'Comfortable family home in a quiet residential area.',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
      }
    ];
    return savedProperties;
  });

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState(1000000);
  const [searchQuery, setSearchQuery] = useState('');

  const filterProperties = useCallback(() => {
    return properties.filter(property => {
      const matchesStatus = statusFilter === 'all' || property.status.toLowerCase() === statusFilter.toLowerCase();
      const matchesType = typeFilter === 'all' || property.type.toLowerCase() === typeFilter.toLowerCase();
      const matchesPrice = property.price <= priceFilter;
      const matchesSearch = 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesType && matchesPrice && matchesSearch;
    });
  }, [properties, statusFilter, typeFilter, priceFilter, searchQuery]);

  const filteredProperties = useMemo(() => filterProperties(), [filterProperties]);

  // Handlers
  const handlePropertyAction = (formData, action) => {
    switch(action) {
      case 'add':
        const newProperty = {
          ...formData,
          id: Date.now(),
          image: 'https://via.placeholder.com/400x300',
        };
        const updatedProperties = [...properties, newProperty];
        setProperties(updatedProperties);
        setShowForm(false);
        setEditingProperty(null);
        break;
      case 'edit':
        setProperties(properties.map(p => p.id === formData.id ? formData : p));
        setShowForm(false);
        setEditingProperty(null);
        localStorage.setItem('properties', JSON.stringify(properties));
        break;
      case 'delete':
        setProperties(properties.filter(p => p.id !== formData.id));
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setShowDetails(true);
  };

  const handleCloseDetails = useCallback(() => {
    setShowDetails(false);
    setSelectedProperty(null);
  }, []);

  // Effects
  useEffect(() => {
    if (showDetails && !properties.find(p => p.id === selectedProperty?.id)) {
      handleCloseDetails();
    }
  }, [properties, showDetails, selectedProperty?.id, handleCloseDetails]);

  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  // JSX
  return (
    <div className="properties-page">
      <div className="properties-header">
        <div className="header-actions">
          <button className="add-property-btn" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus"></i> Add New Property
          </button>
          <div className="header-stats">
            <div className="stat-item">
              <i className="fas fa-home"></i>
              <div>
                <span className="stat-value">{properties.length}</span>
                <span className="stat-label">Total Properties</span>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-check-circle"></i>
              <div>
                <span className="stat-value">{properties.filter(p => p.status === 'Available').length}</span>
                <span className="stat-label">Available</span>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-clock"></i>
              <div>
                <span className="stat-value">{properties.filter(p => p.status === 'Booked').length}</span>
                <span className="stat-label">Booked</span>
              </div>
            </div>
          </div>
        </div>
        <div className="properties-filters">
          <div className="filter-group">
            <label>Status</label>
            <select className="status-filter" onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Type</label>
            <select className="type-filter" onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="villa">Villa</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condo</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Price Range</label>
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              step="10000" 
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            />
            <div className="price-range">
              <span>${priceFilter.toLocaleString()}</span>
              <span>$1,000,000</span>
            </div>
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
      <div className="properties-grid">
        {filteredProperties.map((property) => (
          <div key={property.id} className="property-card">
            <div className="property-image">
              <img src={property.image} alt={property.title} />
              <div className="status-badge {property.status.toLowerCase()}">
                {property.status}
              </div>
              <div className="property-overlay">
                <div className="overlay-content">
                  <h3>{property.title}</h3>
                  <p className="overlay-price">${property.price.toLocaleString()}</p>
                  <button className="quick-view-btn" onClick={() => handleViewDetails(property)}>
                    <i className="fas fa-search"></i> Quick View
                  </button>
                </div>
              </div>
            </div>
            <div className="property-info">
              <div className="property-meta">
                <span className="property-type">{property.type}</span>
                <span className="property-location">{property.location}</span>
              </div>
              <div className="property-details">
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
              </div>
              <div className="property-features">
                {property.amenities?.slice(0, 3).map((amenity, index) => (
                  <div key={index} className="feature-item">
                    <i className={`fas ${getAmenityIcon(amenity)}`}></i>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
              <div className="property-price">
                <span className="price-label">Price:</span>
                <span className="price-value">${property.price.toLocaleString()}</span>
              </div>
              <div className="property-actions">
                <button className="action-btn view-btn" onClick={() => handleViewDetails(property)}>
                  <i className="fas fa-eye"></i> View Details
                </button>
                <button className="action-btn edit-btn" onClick={() => {
                  setEditingProperty(property);
                  setShowForm(true);
                }}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="action-btn delete-btn" onClick={() => handlePropertyAction(property, 'delete')}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
              <button className="close-btn" onClick={() => setShowForm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <PropertyForm
              property={editingProperty}
              onSubmit={formData => handlePropertyAction(formData, editingProperty ? 'edit' : 'add')}
              onClose={() => {
                setShowForm(false);
                setEditingProperty(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Property Details Modal */}
      {showDetails && selectedProperty && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{selectedProperty.title}</h2>
              <button className="close-btn" onClick={handleCloseDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <PropertyDetails property={selectedProperty} onClose={handleCloseDetails} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
