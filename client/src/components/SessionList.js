import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Calendar, Clock, User, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import SessionCard from './SessionCard';
import SessionModal from './SessionModal';
import Loading from './Loading';

const SessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  
  const { isOwner } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('/api/sessions');
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to load sessions');
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = () => {
    setEditingSession(null);
    setShowModal(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setShowModal(true);
  };

  const handleDeleteSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to delete this session?')) {
      return;
    }

    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      toast.success('Session deleted successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to delete session');
      console.error('Error deleting session:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const handleSessionSave = () => {
    fetchSessions();
    handleModalClose();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="section-title">
          <Calendar size={32} />
          Thursday Sessions
        </h1>
        
        {isOwner() && (
          <button onClick={handleAddSession} className="btn btn-primary">
            <Plus size={16} />
            Add Session
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Calendar size={64} />
          </div>
          <h2 className="empty-state-title">No Sessions Yet</h2>
          <p className="empty-state-text">
            {isOwner() 
              ? "Get started by adding your first Thursday session!"
              : "Check back later for upcoming Thursday sessions."
            }
          </p>
          {isOwner() && (
            <button onClick={handleAddSession} className="btn btn-primary" style={{ marginTop: '20px' }}>
              <Plus size={16} />
              Add First Session
            </button>
          )}
        </div>
      ) : (
        <div className="session-grid">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onEdit={handleEditSession}
              onDelete={handleDeleteSession}
              canEdit={isOwner()}
            />
          ))}
        </div>
      )}

      {showModal && (
        <SessionModal
          session={editingSession}
          onClose={handleModalClose}
          onSave={handleSessionSave}
        />
      )}
    </div>
  );
};

export default SessionList; 