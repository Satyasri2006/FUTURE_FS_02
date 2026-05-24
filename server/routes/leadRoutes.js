import express from 'express';
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  addLeadNote,
  deleteLeadNote
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Guard all CRM resource endpoints
router.use(protect);

// Root resource endpoints: /api/leads
router.route('/')
  .get(getAllLeads)
  .post(createLead);

// Single resource endpoints: /api/leads/:id
router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

// Dedicated status fast-update: /api/leads/:id/status
router.route('/:id/status')
  .patch(updateLeadStatus);

// Embedded notes endpoints: /api/leads/:id/notes
router.route('/:id/notes')
  .post(addLeadNote);

// Delete subdocument note: /api/leads/:id/notes/:noteId
router.route('/:id/notes/:noteId')
  .delete(deleteLeadNote);

export default router;
