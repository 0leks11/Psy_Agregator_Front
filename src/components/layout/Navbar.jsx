import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <nav style={{ background: '#eee', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
          Gestalt Hub
        </Link>
        <Link to="/therapists" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>
          Find Therapists
        </Link>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '15px' }}>
              Welcome, {user?.email}! {/* Replace with actual name later */}
            </span>
            <Link to="/dashboard" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>
              Dashboard
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>
              Login
            </Link>
            <Link to="/register" style={{ textDecoration: 'none', color: '#333' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;