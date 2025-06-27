import React from 'react';
import { format } from 'date-fns';
import { Clock, User, Edit, Trash2 } from 'lucide-react';

const SessionCard = ({ session, onEdit, onDelete, canEdit }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM do, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="session-card">
      <h3 className="session-title">{session.title}</h3>
      
      <div className="session-time">
        <Clock size={14} />
        {session.time} • {formatDate(session.date)}
      </div>
      
      {session.presenter && (
        <div className="session-presenter">
          <User size={14} />
          {session.presenter}
        </div>
      )}
      
      {session.description && (
        <div className="session-description">
          {session.description}
        </div>
      )}
      
      {canEdit && (
        <div className="session-actions">
          <button 
            onClick={() => onEdit(session)} 
            className="btn btn-secondary"
            title="Edit session"
          >
            <Edit size={14} />
            Edit
          </button>
          <button 
            onClick={() => onDelete(session.id)} 
            className="btn btn-danger"
            title="Delete session"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionCard; 