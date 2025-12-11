import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user?.cod_rol !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default ProtectedRoute;