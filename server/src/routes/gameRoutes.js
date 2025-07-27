import express from 'express';
const router = express.Router();
import gameService from '../services/gameService.js';
import walletService from '../services/walletService.js';
import cryptoService from '../services/cryptoService.js';
import { validateBetInput } from '../utils/helpers.js';

// Place a bet
router.post('/bet', async (req, res) => {
  try {
    const { userId, amount, currency } = req.body;
    
    validateBetInput(userId, amount, currency);

    // Check wallet balance
    const balance = await walletService.getBalance(userId, currency);
    const price = await cryptoService.getCryptoPrice(currency);
    const cryptoAmount = amount / price;
    
    if (balance < cryptoAmount) {
      return res.status(400).json({ 
        success: false,
        error: 'Insufficient balance' 
      });
    }
    
    // Deduct from wallet
    await walletService.deductFromBalance(userId, currency, cryptoAmount);
    
    // Place bet
    const bet = await gameService.placeBet(userId, amount, currency);
    
    res.json({
      success: true,
      bet,
      newBalance: balance - cryptoAmount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Cash out
router.post('/cashout', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const result = await gameService.cashOut(userId);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) { 
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get current game state
router.get('/state', async (req, res) => {
  try {
    const gameState = await gameService.getCurrentGameState();
    res.json({
      success: true,
      game: gameState || { status: 'waiting' }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get game history
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await gameService.getGameHistory(limit);
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;