import React, { useState, useEffect } from 'react';
import './PropertyForm.css';
import { v4 as uuidv4 } from 'uuid';

const PropertyForm = ({ onClose, onSubmit, property = null }) => {
  const [formData, setFormData] = useState(property || {
    title: '',
    type: '',
    status: 'available',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    location: '',
    image: null,
    previewImage: null
  });

  const [amenities, setAmenities] = useState(property?.amenities || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setAmenities(prev => checked 
      ? [...prev, value] 
      : prev.filter(amenity => amenity !== value)
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or WebP image.');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      image: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        previewImage: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload a property image.');
      return;
    }
    onSubmit({
      ...formData,
      amenities,
      price: parseFloat(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      area: parseInt(formData.area)
    });
  };

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        previewImage: property.image
      });
      setAmenities(property.amenities || []);
    }
  }, [property]);

  const amenitiesList = [
    'Pool', 'Garden', 'Security', 'Parking', 'WiFi', 'Gym', 'Balcony', 'Pet Friendly'
  ];

  const amenityIcons = [
    'fa-swimming-pool', 'fa-tree', 'fa-shield-alt', 'fa-parking', 'fa-wifi', 'fa-dumbbell', 'fa-window-maximize', 'fa-paw'
  ];

  return (
    <div className="property-form-modal">
      <div className="property-form">
        <div className="form-header">
          <h2>{property ? 'Edit Property' : 'Add New Property'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="property-form-content">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Property title"
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select 
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="">Select type</option>
                  <option value="villa">Villa</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="form-control"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Location & Pricing</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Property Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Area (sqft)</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Description</h3>
            <div className="form-group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
                className="form-control"
                placeholder="Enter property description..."
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3>Amenities</h3>
            <div className="amenities-grid">
              {amenitiesList.map((amenity, index) => (
                <div key={index} className="amenity-item">
                  <input
                    type="checkbox"
                    id={`amenity-${uuidv4()}`}
                    value={amenity}
                    checked={amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                    className="amenity-checkbox"
                  />
                  <label htmlFor={`amenity-${uuidv4()}`} className="amenity-label">
                    <i className={`fas ${amenityIcons[index]}`} style={{ marginRight: '8px' }}></i>
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Property Image</h3>
            <div 
              className="image-upload-container"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {formData.previewImage ? (
                <div className="image-preview">
                  <img src={formData.previewImage} alt="Preview" />
                  <button type="button" onClick={() => setFormData(prev => ({
                    ...prev,
                    image: null,
                    previewImage: null
                  }))} className="remove-image-btn">
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <p>Drag and drop an image or click to upload</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {property ? 'Update Property' : 'Add Property'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
