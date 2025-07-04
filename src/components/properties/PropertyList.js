import React from 'react';
import './PropertyList.css';

const PropertyList = () => {
  // This is a placeholder component - will be connected to backend later
  const properties = [
    {
      id: 1,
      title: 'Luxury Apartment',
      location: 'Downtown',
      price: '$1,200,000',
      image: 'https://via.placeholder.com/300'
    },
    {
      id: 2,
      title: 'Family House',
      location: 'Suburbs',
      price: '$850,000',
      image: 'https://via.placeholder.com/300'
    }
  ];

  return (
    <div className="property-list">
      <h2>Available Properties</h2>
      <div className="property-grid">
        {properties.map((property) => (
          <div key={property.id} className="property-card">
            <img src={property.image} alt={property.title} className="property-image" />
            <h3>{property.title}</h3>
            <p className="property-location">{property.location}</p>
            <p className="property-price">{property.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
