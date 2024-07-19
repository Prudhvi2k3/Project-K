// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token with the server
        const response = await axios.get('http://localhost:5000/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);

        // Optionally, refresh the token
        if (response.data.newToken) {
          localStorage.setItem('token', response.data.newToken);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication status
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;