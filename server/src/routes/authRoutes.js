import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import { generateMockHash } from '../utils/helpers.js';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ 
      username,
      wallet: {
        BTC: 0.01,  // Starting balance
        ETH: 0.1    // Starting balance
      }
    });
    
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId: user._id,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-__v -createdAt -updatedAt');
      
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;