import Lead from '../models/Lead.js';

/**
 * @desc    Get all leads with search and status filtering (sorted by newest first)
 * @route   GET /api/leads
 * @access  Public (Auth to be added in Phase 4)
 */
export const getAllLeads = async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    // 1. Filter by status if provided (exact matching)
    if (status) {
      filter.status = status;
    }

    // 2. Search by name, email, or company (case-insensitive regex match)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch leads sorted newest first (createdAt: -1)
    const leads = await Lead.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leads',
      error: error.message
    });
  }
};

/**
 * @desc    Get a single lead by ID with its embedded notes
 * @route   GET /api/leads/:id
 * @access  Public
 */
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    // Handling invalid ObjectID format errors
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Invalid Lead ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error retrieving lead details',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Public
 */
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, source, followUpDate, lastContacted } = req.body;

    const newLead = await Lead.create({
      name,
      email,
      phone,
      company,
      status,
      source,
      followUpDate,
      lastContacted
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: newLead
    });
  } catch (error) {
    // Handle Mongoose validation errors (e.g. required name, invalid enum)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error creating lead',
      error: error.message
    });
  }
};

/**
 * @desc    Update a lead's metadata
 * @route   PUT /api/leads/:id
 * @access  Public
 */
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with ID: ${req.params.id}`
      });
    }

    // Update with new body keys (using validation parameters)
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating lead',
      error: error.message
    });
  }
};

/**
 * @desc    Update lead status only
 * @route   PATCH /api/leads/:id/status
 * @access  Public
 */
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status value'
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.status = status;
    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: lead
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error updating status',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Public
 */
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with ID: ${req.params.id}`
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Lead successfully deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting lead',
      error: error.message
    });
  }
};

/**
 * @desc    Add a note to a lead's embedded notes array
 * @route   POST /api/leads/:id/notes
 * @access  Public
 */
export const addLeadNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty'
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Push new subdocument to the embedded notes array
    lead.notes.push({ content });
    await lead.save();

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: lead.notes[lead.notes.length - 1] // Return the newly created note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error adding note',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a note from a lead's embedded notes array
 * @route   DELETE /api/leads/:id/notes/:noteId
 * @access  Public
 */
export const deleteLeadNote = async (req, res) => {
  try {
    const { id, noteId } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    // Check if note exists in embedded array
    const note = lead.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Remove subdocument note from array
    lead.notes.pull(noteId);
    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Note successfully removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting note',
      error: error.message
    });
  }
};
