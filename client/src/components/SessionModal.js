import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionModal = ({ session, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    date: '',
    presenter: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || '',
        description: session.description || '',
        time: session.time || '',
        date: session.date || '',
        presenter: session.presenter || ''
      });
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.time || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      if (session) {
        // Update existing session
        await axios.put(`/api/sessions/${session.id}`, formData);
        toast.success('Session updated successfully');
      } else {
        // Create new session
        await axios.post('/api/sessions', formData);
        toast.success('Session created successfully');
      }
      
      onSave();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save session');
      console.error('Error saving session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {session ? 'Edit Session' : 'Add New Session'}
          </h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter session title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-input form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter session description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="time" className="form-label">
              Time *
            </label>
            <input
              type="time"
              id="time"
              name="time"
              className="form-input"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="presenter" className="form-label">
              Presenter
            </label>
            <input
              type="text"
              id="presenter"
              name="presenter"
              className="form-input"
              value={formData.presenter}
              onChange={handleChange}
              placeholder="Enter presenter name"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} />
              {loading ? 'Saving...' : (session ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionModal; 