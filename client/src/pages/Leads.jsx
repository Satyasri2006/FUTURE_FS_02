import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, createLead } from '../services/leads';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter tab state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'New', 'Contacted', 'Converted'

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
    source: 'Website',
    followUpDate: '',
    lastContacted: ''
  });

  useEffect(() => {
    fetchLeadsData();
  }, [searchTerm, activeTab]);

  const fetchLeadsData = async () => {
    try {
      setLoading(true);
      const response = await getLeads(searchTerm, activeTab);
      setLeads(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads list. Ensure the backend is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setModalError('Name and Email are required fields.');
      return;
    }

    try {
      setModalLoading(true);
      setModalError(null);
      
      // Call creation service helper
      const response = await createLead(formData);

      // Add the new lead to local state (at the beginning of array - newest first)
      setLeads(prev => [response.data.data, ...prev]);
      
      // Reset form and close
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'New',
        source: 'Website',
        followUpDate: '',
        lastContacted: ''
      });
      setShowModal(false);
    } catch (err) {
      console.error('Error creating lead:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setModalError(err.response.data.message);
      } else {
        setModalError('Failed to create new lead. Please check your inputs.');
      }
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8 bg-bg overflow-y-auto h-full fade-in relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Leads Directory</h1>
          <p className="text-sm text-muted">Search, filter, and track leads details and progress.</p>
        </div>
        <div>
          <button 
            onClick={() => {
              setModalError(null);
              setShowModal(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition-all duration-150 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filters and Search Bar Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card p-4 rounded-xl border border-muted/20 shadow-sm mb-6">
        {/* Status Filter Tabs */}
        <div className="flex border-b border-muted/10 pb-2 md:pb-0 md:border-b-0 gap-1 overflow-x-auto">
          {['All', 'New', 'Contacted', 'Converted'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-muted hover:bg-bg hover:text-text border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-muted/20 rounded-lg text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
          />
        </div>
      </div>

      {/* Main Leads Display Container */}
      <div className="bg-card rounded-xl border border-muted/20 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs font-semibold text-muted">Loading Directory...</p>
          </div>
        ) : error ? (
          <div className="py-8 px-4 text-center text-red-500 text-xs font-medium bg-red-50/50">
            {error}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-full bg-bg text-muted flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-bold text-text text-sm">No leads match criteria</h3>
            <p className="text-xs text-muted max-w-sm mt-1">
              Try adjusting your active status filter tabs or search input query to locate specific profile records.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-muted/10 text-muted text-xs font-bold uppercase tracking-wider bg-bg/30">
                  <th className="py-3.5 pl-6">Lead Name</th>
                  <th className="py-3.5">Company</th>
                  <th className="py-3.5">Phone</th>
                  <th className="py-3.5">Source</th>
                  <th className="py-3.5">Status</th>
                  <th className="py-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-bg/50 transition duration-100">
                    <td className="py-4 pl-6">
                      <div className="font-semibold text-text">{lead.name}</div>
                      <div className="text-xs text-muted font-medium">{lead.email}</div>
                    </td>
                    <td className="py-4 text-muted font-medium">{lead.company || '-'}</td>
                    <td className="py-4 text-muted font-medium text-xs">{lead.phone || '-'}</td>
                    <td className="py-4 text-muted text-xs font-semibold">{lead.source}</td>
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
                    <td className="py-4 pr-6 text-right">
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

      {/* Add Lead Form Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-card rounded-xl border border-muted/20 shadow-xl max-w-lg w-full overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-muted/10 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-text text-sm">Add New Lead Profile</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-muted hover:text-muted font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-semibold">
                  {modalError}
                </div>
              )}

              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Lead Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter full name"
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@company.com"
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 012-3456"
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Corp"
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Row 3: Status & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Initial Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-bold bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Lead Source</label>
                  <input
                    type="text"
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                    placeholder="Website, Referral, Event..."
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Row 4: Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Last Contacted Date</label>
                  <input
                    type="date"
                    name="lastContacted"
                    value={formData.lastContacted}
                    onChange={handleInputChange}
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Follow-Up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate}
                    onChange={handleInputChange}
                    className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-muted/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-muted/20 hover:bg-bg text-text rounded-lg text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:border-muted/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  {modalLoading ? 'Saving...' : 'Save Lead Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
