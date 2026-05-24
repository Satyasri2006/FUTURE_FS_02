import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to restrict route access to authenticated Admins only.
 */
export const protect = async (req, res, next) => {
  let token;

  // 1. Read token from Bearer Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 2. Decode and verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find User associated with decoded token payload, omitting password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, admin profile no longer exists'
        });
      }

      return next(); // Proceed to controller
    } catch (error) {
      console.error('[Auth Error] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, login token is invalid or expired'
      });
    }
  }

  // If no token was found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no session token provided'
    });
  }
};
