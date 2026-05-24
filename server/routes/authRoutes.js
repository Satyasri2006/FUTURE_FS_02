import express from 'express';
import { loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public auth endpoints
router.post('/login', loginUser);

// Protected session check route
router.get('/me', protect, getMe);

export default router;
