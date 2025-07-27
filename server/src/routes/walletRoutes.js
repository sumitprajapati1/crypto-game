import express from 'express';
const router = express.Router();
import walletService from '../services/walletService.js';
import cryptoService from '../services/cryptoService.js';
import Transaction from '../models/transaction.js';
import { generateMockHash } from '../utils/helpers.js';

// Get wallet balance
router.get('/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currency } = req.query;

    if (currency) {
      const balance = await walletService.getBalance(userId, currency);
      const price = await cryptoService.getCryptoPrice(currency);
      
      return res.json({
        success: true,
        balance: {
          crypto: balance,
          usd: balance * price,
          currency
        }
      });
    }

    const balances = await walletService.getBalances(userId);
    res.json({
      success: true,
      balances
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Add funds (for testing/demo purposes)
router.post('/deposit', async (req, res) => {
  try {
    const { userId, currency, amount } = req.body;
    
    if (!['BTC', 'ETH'].includes(currency)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid currency' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount must be positive' 
      });
    }

    const newBalance = await walletService.addToBalance(userId, currency, amount);
    const price = await cryptoService.getCryptoPrice(currency);

    // Record transaction
    const transaction = new Transaction({
      userId,
      type: 'deposit',
      currency,
      cryptoAmount: amount,
      usdAmount: amount * price,
      priceAtTime: price,
      transactionHash: generateMockHash(),
      status: 'completed'
    });
    await transaction.save();

    res.json({
      success: true,
      newBalance: {
        crypto: newBalance,
        usd: newBalance * price,
        currency
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get transaction history
router.get('/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit, type } = req.query;
    
    const query = { userId };
    if (type) query.type = type;
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit) || 20)
      .select('-__v');
      
    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;