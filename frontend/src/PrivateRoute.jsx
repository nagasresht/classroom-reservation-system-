import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PrivateRoute({ children, requireAdmin = false }) {
  const location = useLocation();
  
  // Check if user exists in localStorage
  const userString = localStorage.getItem('user');
  
  if (!userString) {
    // No user found, redirect to login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  try {
    // Parse user data
    const user = JSON.parse(userString);
    
    // Validate user object has required fields
    if (!user.email || !user.name) {
      console.error('Invalid user data in localStorage');
      localStorage.removeItem('user');
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If admin route is required, check if user is admin
    if (requireAdmin) {
      if (user.role !== 'admin') {
        console.warn('Unauthorized access attempt to admin route');
        // Redirect to user dashboard if not admin
        return <Navigate to="/dashboard" replace />;
      }
    }

    // User is authenticated (and admin if required)
    return children;
    
  } catch (error) {
    // Invalid JSON in localStorage
    console.error('Failed to parse user data:', error);
    localStorage.removeItem('user');
    return <Navigate to="/" state={{ from: location }} replace />;
  }
}
