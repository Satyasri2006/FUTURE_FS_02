import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';

const App = () => {
  return (
    <Router>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans antialiased text-gray-900">
        {/* Sidebar Nav */}
        <Sidebar />

        {/* Main Content Layout Block */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header Bar */}
          <Navbar />

          {/* Core App Main Frame */}
          <main className="flex-1 overflow-hidden h-full">
            <Routes>
              {/* Core Application Views */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/leads/:id" element={<LeadDetails />} />
              
              {/* Fallback Redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
