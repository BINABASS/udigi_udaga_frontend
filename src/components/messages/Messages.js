import React, { useState, useEffect, useMemo } from 'react';
import MessageForm from './MessageForm';
import MessageDetails from './MessageDetails';
import './Messages.css';

const MESSAGE_TYPES = {
  ALL: 'all',
  INBOX: 'inbox',
  SENT: 'sent',
  DRAFT: 'draft'
};

const Messages = () => {
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState(MESSAGE_TYPES.INBOX);

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = JSON.parse(localStorage.getItem('messages')) || [
      {
        id: 1,
        type: 'inbox',
        subject: 'Property Inquiry - Modern Villa',
        sender: 'john@example.com',
        receiver: 'admin@example.com',
        content: 'Hi, I am interested in the Modern Villa property. Could you provide more details about its availability and pricing?',
        date: '2025-07-03',
        isRead: false,
        attachments: ['house.jpg', 'location-map.pdf']
      },
      {
        id: 2,
        type: 'sent',
        subject: 'Property Details - Modern Villa',
        sender: 'admin@example.com',
        receiver: 'john@example.com',
        content: 'Dear John, thank you for your interest. The Modern Villa is currently available and priced at $500,000. Please find attached the property details and location map.',
        date: '2025-07-03',
        isRead: true,
        attachments: ['property-details.pdf', 'price-list.pdf']
      }
    ];

    setMessages(savedMessages);
    setIsLoading(false);
  }, []);

  // Calculate statistics
  const statistics = useMemo(() => {
    return {
      total: messages.length,
      unread: messages.filter(m => !m.isRead).length,
      inbox: messages.filter(m => m.type === 'inbox').length,
      sent: messages.filter(m => m.type === 'sent').length,
      draft: messages.filter(m => m.type === 'draft').length
    };
  }, [messages]);

  // Filter messages based on selected type and search
  const filteredMessages = useMemo(() => {
    let filtered = [...messages];
    
    if (selectedType !== MESSAGE_TYPES.ALL) {
      filtered = filtered.filter(message => message.type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(message => 
        message.subject.toLowerCase().includes(query) ||
        message.sender.toLowerCase().includes(query) ||
        message.receiver.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [messages, selectedType, searchQuery]);

  // Handlers
  const handleMessageAction = (formData, action) => {
    if (action === 'send') {
      const newMessage = {
        ...formData,
        id: Date.now(),
        isRead: false,
        date: new Date().toISOString().split('T')[0]
      };
      setMessages([...messages, newMessage]);
      localStorage.setItem('messages', JSON.stringify([...messages, newMessage]));
    } else if (action === 'edit') {
      const updatedMessages = messages.map(message => 
        message.id === editingMessage.id ? { ...message, ...formData } : message
      );
      setMessages(updatedMessages);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updatedMessages = messages.filter(message => message.id !== messageId);
      setMessages(updatedMessages);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
    }
  };

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setShowDetails(true);
  };

  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setShowForm(true);
  };

  const markAsRead = (messageId) => {
    const updatedMessages = messages.map(message => 
      message.id === messageId ? { ...message, isRead: true } : message
    );
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  return (
    <div className="messages-page">
      <div className="messages-header">
        <h1>Messages</h1>
        <div className="header-actions">
          <div className="type-filters">
            <h2>Filter by Type:</h2>
            <div className="filters-container">
              {Object.entries(MESSAGE_TYPES).map(([key, value]) => (
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
              placeholder="Search by subject, sender, or receiver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="messages-statistics">
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
          <p>Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="empty-state">
          <p>No messages found</p>
          <button
            className="action-btn add-btn"
            onClick={() => setShowForm(true)}
          >
            <i className="fas fa-plus"></i> New Message
          </button>
        </div>
      ) : (
        <div className="messages-grid">
          {filteredMessages.map((message) => (
            <div key={message.id} className="message-card">
              <div className="message-header">
                <div className="message-sender">
                  <h3>{message.subject}</h3>
                  <div className="sender-info">
                    <span className="sender-name">
                      {message.type === 'inbox' ? message.sender : message.receiver}
                    </span>
                    <span className="message-date">{message.date}</span>
                  </div>
                </div>
                <div className="message-status">
                  {message.type === 'inbox' && !message.isRead && (
                    <span className="status-badge unread">Unread</span>
                  )}
                  {message.type === 'draft' && (
                    <span className="status-badge draft">Draft</span>
                  )}
                </div>
              </div>
              <div className="message-preview">
                {message.content.substring(0, 150)}...
              </div>
              <div className="message-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => handleViewDetails(message)}
                >
                  <i className="fas fa-eye"></i> View
                </button>
                {message.type !== 'draft' && (
                  <button
                    className="action-btn reply-btn"
                    onClick={() => handleEditMessage(message)}
                  >
                    <i className="fas fa-reply"></i> Reply
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <MessageForm
          message={editingMessage}
          onClose={() => {
            setShowForm(false);
            setEditingMessage(null);
          }}
          onSubmit={handleMessageAction}
        />
      )}

      {showDetails && selectedMessage && (
        <MessageDetails
          message={selectedMessage}
          onClose={() => {
            setShowDetails(false);
            setSelectedMessage(null);
          }}
          onRead={() => markAsRead(selectedMessage.id)}
        />
      )}
    </div>
  );
};

export default Messages;
