import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Login from './pages/Login';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';

/**
 * Main application content wrapper that checks context to mount appropriate layout framework.
 */
const AppContent = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
  return (
    <div className="flex items-center justify-center h-screen bg-bg text-text">
      Loading...
    </div>
  );
}

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg font-sans antialiased text-text">
      {/* Sidebar Nav - Active for logged-in sessions */}
      <Sidebar />

      {/* Main Content Layout Block */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Navbar />

        {/* Core App Main Frame */}
        <main className="flex-1 overflow-hidden h-full">
          <Routes>
            {/* Core Application Views shielded by ProtectedRoute */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leads" 
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leads/:id" 
              element={
                <ProtectedRoute>
                  <LeadDetails />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            {/* Fallback Redirect to index */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
<Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
