import express from 'express';
const router = express.Router();

// Import all route files
import authRoutes from './authRoutes.js';
import gameRoutes from './gameRoutes.js';
import walletRoutes from './walletRoutes.js';
import cryptoRoutes from './cryptoRoutes.js';

// Setup routes
router.use('/auth', authRoutes);
router.use('/game', gameRoutes);
router.use('/wallet', walletRoutes);
router.use('/crypto', cryptoRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
router.use('/:path', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

export default router;