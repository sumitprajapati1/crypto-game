import express from 'express';
import cors from 'cors';
import connectDB from './src/config/db.js';
import mainRouter from './src/routes/index.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Main router
app.use('/api', mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

export default app;