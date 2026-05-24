import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

/**
 * Route wrapper that blocks unauthenticated navigation.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Render a clean fallback loading screen while verifying stored tokens
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-muted">Verifying session operator...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if user session is absent
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render requested child elements if session is valid
  return children;
};

export default ProtectedRoute;
