import React, { useState } from 'react';
import './Messages.css';

const MessageForm = ({ message, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: message?.subject || '',
    type: message?.type || 'inbox',
    content: message?.content || '',
    attachments: message?.attachments || []
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
    onSubmit(formData, message ? 'edit' : 'send');
    onClose();
  };

  return (
    <div className="message-form-modal">
      <div className="message-form">
        <h2>{message ? 'Edit Message' : 'New Message'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="inbox">Inbox</option>
              <option value="sent">Sent</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">Message:</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="6"
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="attachments">Attachments:</label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setFormData(prev => ({
                  ...prev,
                  attachments: [...prev.attachments, ...files.map(file => file.name)]
                }));
              }}
            />
          </div>

          <div className="form-actions">
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
              {message ? 'Update' : 'Send'} Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
