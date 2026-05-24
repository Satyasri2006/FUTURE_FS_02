import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas database
connectDB();

const app = express();

// Standard middlewares
app.use(cors());
app.use(express.json()); // Enable standard JSON request parsing

// Root API Health status check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Mini CRM API Server is active and running',
    timestamp: new Date().toISOString()
  });
});

// Fallback Route for non-existent endpoints (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`
  });
});

// Global Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(`[Error Handler] ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Express active on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
