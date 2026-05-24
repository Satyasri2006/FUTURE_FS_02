import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Generate a standard secure JWT token
 * @param {string} id - User Document ID
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token expires in 30 days
  });
};

/**
 * @desc    Authenticate admin and retrieve session JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find User by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Validate email and matching hashed password
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

/**
 * @desc    Get current validated Admin session profile details
 * @route   GET /api/auth/me
 * @access  Private (Guarded by protect middleware)
 */
export const getMe = async (req, res) => {
  try {
    // req.user has already been populated in protect middleware
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving admin profile',
      error: error.message
    });
  }
};
