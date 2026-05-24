import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Helper to resolve clean display title based on active pathing
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard Analytics';
      case '/leads':
        return 'Leads Directory';
      default:
        if (location.pathname.startsWith('/leads/')) {
          return 'Lead Profile Details';
        }
        return 'Mini CRM';
    }
  };

  const getTodayDateString = () => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <header className="h-16 bg-card border-b border-muted/20 flex items-center justify-between px-8 flex-shrink-0">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-text tracking-tight">{getPageTitle()}</h2>
      </div>

      {/* Meta Indicators */}
      <div className="flex items-center gap-6">
        {/* Localized Date Card */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted bg-surface px-3.5 py-1.5 rounded-full">
          <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{getTodayDateString()}</span>
        </div>

        {/* User status Indicator */}
        <div className="flex items-center gap-3 pl-4 border-l border-muted/20">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text">Admin Operator</p>
            <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 inline-block uppercase tracking-wider">
              Connected
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 shadow-sm">
            OP
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
