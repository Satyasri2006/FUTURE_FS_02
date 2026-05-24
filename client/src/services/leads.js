import API from './api';

/**
 * Fetch all leads with optional search and status filtering
 * @param {string} search - Name, email, or company search term
 * @param {string} status - Pipeline status filter ('New', 'Contacted', 'Converted')
 */
export const getLeads = async (search = '', status = '') => {
  const params = {};
  if (search.trim()) params.search = search;
  if (status && status !== 'All') params.status = status;

  return API.get('/leads', { params });
};

/**
 * Fetch individual lead details by ID
 * @param {string} id - Lead MongoDB ObjectId
 */
export const getLeadById = async (id) => {
  return API.get(`/leads/${id}`);
};

/**
 * Create a new lead profile
 * @param {Object} leadData - Form data representing the new lead
 */
export const createLead = async (leadData) => {
  return API.post('/leads', leadData);
};

/**
 * Update an existing lead profile completely
 * @param {string} id - Lead ID
 * @param {Object} leadData - Updated lead profile details
 */
export const updateLead = async (id, leadData) => {
  return API.put(`/leads/${id}`, leadData);
};

/**
 * Quick-update a lead's pipeline status stage
 * @param {string} id - Lead ID
 * @param {string} status - New pipeline status ('New', 'Contacted', 'Converted')
 */
export const updateLeadStatus = async (id, status) => {
  return API.patch(`/leads/${id}/status`, { status });
};

/**
 * Delete a lead record
 * @param {string} id - Lead ID
 */
export const deleteLead = async (id) => {
  return API.delete(`/leads/${id}`);
};

/**
 * Append a note to a lead's subdocument notes timeline
 * @param {string} id - Lead ID
 * @param {string} content - Discussion note text
 */
export const addLeadNote = async (id, content) => {
  return API.post(`/leads/${id}/notes`, { content });
};

/**
 * Delete a note from a lead's timeline
 * @param {string} id - Lead ID
 * @param {string} noteId - Note subdocument ID
 */
export const deleteLeadNote = async (id, noteId) => {
  return API.delete(`/leads/${id}/notes/${noteId}`);
};
