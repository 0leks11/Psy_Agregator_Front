import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // Assume you have this component

// requiredRole can be 'client', 'therapist', or undefined (just needs login)
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show loading indicator while checking auth status
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This allows us to send them back after login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check if the user has it
  if (requiredRole && user?.role !== requiredRole) {
     // Redirect to a relevant page (e.g., dashboard or home) or show an unauthorized message
     console.warn(`Access denied. Role '${requiredRole}' required, user has role '${user?.role}'.`);
     return <Navigate to="/dashboard" replace />; // Or maybe "/" or a dedicated "Unauthorized" page
  }


  return children; // Render the protected component
};

export default ProtectedRoute;