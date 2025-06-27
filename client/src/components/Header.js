import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, LogIn, LogOut, User } from 'lucide-react';

const Header = () => {
  const { user, logout, isOwner } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="nav-brand">
            <Calendar size={24} />
            Thursday Sessions
          </Link>
          
          <div className="nav-menu">
            {user ? (
              <>
                <span className="nav-link">
                  <User size={16} />
                  {user.username} {isOwner() && '(Owner)'}
                </span>
                <button onClick={logout} className="btn btn-secondary">
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                <LogIn size={16} />
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 