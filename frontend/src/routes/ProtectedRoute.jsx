import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { showWarning } = useToast();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-darkest)', color: 'var(--accent-cyan)' }}>
        Loading CyberShield Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Show role restriction warning
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        showWarning('Access restricted: You do not have permission to view that resource.');
      }, 50);
    }

    if (user?.role === 'ROLE_ADMIN') {
      return <Navigate to="/admin" replace />;
    } else if (user?.role === 'ROLE_COORDINATOR' || user?.role === 'ROLE_INVESTIGATOR') {
      return <Navigate to="/coordinator" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};
