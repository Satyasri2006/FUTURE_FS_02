import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLeadNote,
  deleteLead
} from '../services/leads';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notes state
  const [noteContent, setNoteContent] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const response = await getLeadById(id);
      setLead(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching lead details:', err);
      setError('Failed to load lead details. The record may have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const response = await updateLeadStatus(id, newStatus);
      setLead(prev => ({ ...prev, status: response.data.data.status }));
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this lead profile?')) return;
    try {
      await deleteLead(id);
      navigate('/leads');
    } catch (err) {
      alert('Failed to delete lead.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    try {
      setNoteSubmitting(true);
      const response = await addLeadNote(id, noteContent);
      // Add the new note back to local state array
      setLead(prev => ({
        ...prev,
        notes: [...prev.notes, response.data.data]
      }));
      setNoteContent('');
    } catch (err) {
      alert('Failed to save note.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note permanent?')) return;
    try {
      await deleteLeadNote(id, noteId);
      setLead(prev => ({
        ...prev,
        notes: prev.notes.filter(n => n._id !== noteId)
      }));
    } catch (err) {
      alert('Failed to delete note.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-bg h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-muted">Loading Lead Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex-grow p-8 bg-bg h-full">
        <div className="bg-card border border-muted/20 rounded-xl p-8 text-center max-w-md mx-auto shadow-sm mt-12">
          <h3 className="font-bold text-text text-lg">Lead Profile Missing</h3>
          <p className="text-xs text-muted mt-2 mb-6">{error || 'Record was not found.'}</p>
          <Link to="/leads" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition">
            Return to Leads Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-bg overflow-y-auto h-full fade-in">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link to="/leads" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-blue-600 transition">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Leads</span>
        </Link>
      </div>

      {/* Grid: 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Metadata Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl border border-muted/20 shadow-sm p-6">
            {/* Header Identity */}
            <div className="flex items-center gap-4 border-b border-muted/10 pb-5 mb-5">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 font-bold text-lg flex items-center justify-center border border-blue-200 shadow-sm">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-text truncate">{lead.name}</h2>
                <p className="text-xs text-muted font-semibold truncate">{lead.company || 'Individual Lead'}</p>
              </div>
            </div>

            {/* Profile Fields List */}
            <div className="space-y-4 text-xs font-medium text-muted">
              {/* Status Selector */}
              <div>
                <label className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1">Pipeline Status</label>
                <select
                  value={lead.status}
                  onChange={handleStatusChange}
                  className="w-full border border-muted/20 rounded-lg px-3 py-2 text-xs font-bold bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-0.5">Email Address</span>
                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline font-semibold block truncate">
                  {lead.email}
                </a>
              </div>

              {/* Phone */}
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-0.5">Phone Number</span>
                <span className="text-text font-semibold block">{lead.phone || '-'}</span>
              </div>

              {/* Lead Source */}
              <div>
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-0.5">Acquisition Source</span>
                <span className="text-text font-semibold block">{lead.source}</span>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 border-t border-muted/10 pt-4">
                <div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-0.5">Last Contact</span>
                  <span className="text-text font-semibold block text-[11px]">
                    {lead.lastContacted 
                      ? new Date(lead.lastContacted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Never'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-0.5">Follow-Up Target</span>
                  <span className="text-blue-600 font-bold block text-[11px]">
                    {lead.followUpDate
                      ? new Date(lead.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Not Scheduled'}
                  </span>
                </div>
              </div>

              {/* Delete Lead Button */}
              <div className="mt-6 pt-5 border-t border-muted/10">
                <button
                  onClick={handleDeleteLead}
                  className="w-full px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-xs font-semibold shadow-sm transition duration-150 flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Lead Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction logs / Notes Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-muted/20 shadow-sm p-6 flex flex-col h-full">
            <div className="border-b border-muted/10 pb-4 mb-4">
              <h3 className="font-bold text-text">Discussion Logs & Remarks</h3>
              <p className="text-xs text-muted">Keep a detailed timeline of client follow-ups and interactions.</p>
            </div>

            {/* Note Input Editor */}
            <form onSubmit={handleAddNote} className="mb-6">
              <textarea
                placeholder="Log a new conversation, outcome, or follow-up note..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={3}
                className="w-full border border-muted/20 rounded-lg p-3 text-xs font-semibold text-text bg-bg focus:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={noteSubmitting || !noteContent.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:border-muted/20 text-white disabled:text-muted rounded-lg text-xs font-bold shadow-sm transition"
                >
                  {noteSubmitting ? 'Posting...' : 'Post Log Entry'}
                </button>
              </div>
            </form>

            {/* Note Timeline List */}
            <div className="space-y-4">
              {lead.notes.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-muted/10 rounded-xl flex flex-col items-center justify-center text-center px-4">
                  <p className="text-xs text-muted font-medium max-w-xs">
                    No timeline remarks registered. Log your first follow-up discussion above.
                  </p>
                </div>
              ) : (
                <div className="relative border-l-2 border-muted/10 pl-6 ml-3 space-y-6">
                  {/* Map notes in reverse order so latest note is on top of feed */}
                  {[...lead.notes].reverse().map((note) => (
                    <div key={note._id} className="relative group fade-in">
                      {/* Timeline node dot */}
                      <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 bg-blue-500 border-2 border-white rounded-full shadow-sm ring-4 ring-blue-50"></span>
                      
                      <div className="bg-bg p-4 rounded-xl border border-muted/10 shadow-sm relative group-hover:border-muted/20 transition">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-xs font-semibold text-text leading-relaxed whitespace-pre-wrap">{note.content}</p>
                          <button
                            onClick={() => handleDeleteNote(note._id)}
                            className="text-muted hover:text-red-600 opacity-0 group-hover:opacity-100 transition duration-150"
                            title="Delete log entry"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <div className="text-[10px] text-muted font-bold mt-2.5 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at{' '}
                            {new Date(note.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
