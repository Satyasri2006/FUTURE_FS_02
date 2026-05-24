import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeads } from '../services/leads';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getLeads();
        setLeads(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Could not connect to API server. Ensure backend is active.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute CRM pipeline aggregates
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-muted">Loading Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 bg-bg overflow-y-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 shadow-sm max-w-xl mx-auto mt-10">
          <div className="flex gap-3">
            <svg className="w-6 h-6 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Connection Error</h3>
              <p className="text-sm mt-1">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-bg overflow-y-auto h-full fade-in">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">Operational Overview</h1>
        <p className="text-sm text-muted">Monitor current leads intake, interactions, and conversions.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Total Leads */}
        <div className="bg-card p-6 rounded-xl border border-muted/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Total Leads</span>
            <h3 className="text-3xl font-bold text-text mt-1">{totalLeads}</h3>
            <span className="text-[10px] text-muted font-medium">In CRM Database</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>

        {/* Card 2: Contacted */}
        <div className="bg-card p-6 rounded-xl border border-muted/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Contacted Leads</span>
            <h3 className="text-3xl font-bold text-amber-600 mt-1">{contactedLeads}</h3>
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
              {totalLeads > 0 ? ((contactedLeads / totalLeads) * 100).toFixed(0) : 0}% of total
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
        </div>

        {/* Card 3: Converted */}
        <div className="bg-card p-6 rounded-xl border border-muted/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Converted Leads</span>
            <h3 className="text-3xl font-bold text-emerald-600 mt-1">{convertedLeads}</h3>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              {totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(0) : 0}% of total
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="bg-card p-6 rounded-xl border border-muted/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider">Win Ratio</span>
            <h3 className="text-3xl font-bold text-indigo-600 mt-1">{conversionRate}%</h3>
            <span className="text-[10px] text-muted font-medium">Conversion Rate</span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content: Recent activity lists */}
      <div className="bg-card rounded-xl border border-muted/20 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-text">Recently Registered Leads</h2>
            <p className="text-xs text-muted">Latest pipeline logs added to the database.</p>
          </div>
          <Link 
            to="/leads" 
            className="px-4 py-2 bg-surface hover:border-muted/20 text-text font-semibold text-xs rounded-lg transition"
          >
            Manage All Leads
          </Link>
        </div>

        {leads.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-text">No leads registered yet</h3>
            <p className="text-xs text-muted max-w-sm mt-1 mb-4">
              Your database cluster is empty. Head over to the leads directory page to insert your first record.
            </p>
            <Link 
              to="/leads" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Add Your First Lead
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-muted/10 text-muted text-xs font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-4">Lead Name</th>
                  <th className="pb-3">Company</th>
                  <th className="pb-3">Source</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Registered</th>
                  <th className="pb-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="hover:bg-bg/50 transition">
                    <td className="py-4 pl-4">
                      <div className="font-semibold text-text">{lead.name}</div>
                      <div className="text-xs text-muted">{lead.email}</div>
                    </td>
                    <td className="py-4 text-muted font-medium">{lead.company || '-'}</td>
                    <td className="py-4 text-muted text-xs font-medium">{lead.source}</td>
                    <td className="py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${
                        lead.status === 'New' 
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                          : lead.status === 'Contacted' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200' 
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-muted font-medium">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <Link 
                        to={`/leads/${lead._id}`} 
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
