import React from 'react';
import './PropertyDetails.css';

const PropertyDetails = ({ property, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  // Get amenity icon class based on amenity type
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      pool: 'fa-swimming-pool',
      garden: 'fa-tree',
      parking: 'fa-car',
      gym: 'fa-dumbbell',
      security: 'fa-shield-alt',
      wifi: 'fa-wifi'
    };
    return iconMap[amenity] || 'fa-check';
  };

  return (
    <div className="property-details-modal">
      <div className="property-details-content">
        <div className="property-header">
          <div className="property-image">
            <img src={property.image} alt={property.title} />
          </div>
          <div className="property-info-header">
            <h1 className="property-title">{property.title}</h1>
            <div className="property-price-status">
              <span className="price-tag">${property.price.toLocaleString()}</span>
              <span className={`status-badge ${property.status.toLowerCase()}`}>
                {property.status}
              </span>
            </div>
          </div>
          <button onClick={handleClose} className="close-btn">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="property-details-main">
          <div className="property-features">
            <div className="feature-item">
              <i className="fas fa-home"></i>
              <span>Type: {property.type}</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-bed"></i>
              <span>Beds: {property.beds}</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-bath"></i>
              <span>Baths: {property.baths}</span>
            </div>
            <div className="feature-item">
              <i className="fas fa-ruler-combined"></i>
              <span>Size: {property.size}</span>
            </div>
          </div>

          <div className="property-location">
            <i className="fas fa-map-marker-alt"></i>
            <span>{property.location}</span>
          </div>

          <div className="property-actions">
            <button className="edit-btn">Edit</button>
            <button className="delete-btn">Delete</button>
          </div>
        </div>

        <div className="property-details-section">
          <div className="section-title">
            <h2>Description</h2>
            <button onClick={handleClose} className="view-details-btn">View Details</button>
          </div>
          <div className="section-content">
            <p>{property.description}</p>
          </div>
        </div>

        <div className="property-details-section">
          <h2>Amenities</h2>
          <div className="amenities-grid">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item">
                <i className={`fas ${getAmenityIcon(amenity)}`}></i>
                <span>{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="property-footer">
          <div className="action-buttons">
            <button onClick={handleClose} className="back-btn">
              <i className="fas fa-arrow-left"></i> Back to Properties
            </button>
            <button onClick={() => window.location.href = `/booking/${property.id}`} className="book-now-btn">
              <i className="fas fa-calendar-check"></i> Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
