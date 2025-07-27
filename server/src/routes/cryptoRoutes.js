import express from 'express';
const router = express.Router();
import cryptoService from '../services/cryptoService.js';

// Test route to verify the router is working
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Crypto routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Get current price for a specific cryptocurrency
router.get('/price/:currency', async (req, res) => {
  try {
    const { currency } = req.params;
    
    if (!['BTC', 'ETH'].includes(currency)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid currency. Supported currencies: BTC, ETH' 
      });
    }

    const price = await cryptoService.getCryptoPrice(currency);
    
    res.json({
      success: true,
      price,
      currency,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching crypto price:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get current prices for all supported cryptocurrencies
router.get('/prices', async (req, res) => {
  try {
    const prices = await cryptoService.getAllPrices();
    
    res.json({
      success: true,
      prices,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Convert USD amount to crypto amount
router.post('/convert/usd-to-crypto', async (req, res) => {
  try {
    const { usdAmount, currency } = req.body;
    
    if (!usdAmount || !currency) {
      return res.status(400).json({ 
        success: false,
        error: 'USD amount and currency are required' 
      });
    }

    if (!['BTC', 'ETH'].includes(currency)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid currency. Supported currencies: BTC, ETH' 
      });
    }

    const price = await cryptoService.getCryptoPrice(currency);
    const cryptoAmount = usdAmount / price;
    
    res.json({
      success: true,
      usdAmount,
      cryptoAmount,
      currency,
      price
    });
  } catch (error) {
    console.error('Error converting USD to crypto:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Convert crypto amount to USD
router.post('/convert/crypto-to-usd', async (req, res) => {
  try {
    const { cryptoAmount, currency } = req.body;
    
    if (!cryptoAmount || !currency) {
      return res.status(400).json({ 
        success: false,
        error: 'Crypto amount and currency are required' 
      });
    }

    if (!['BTC', 'ETH'].includes(currency)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid currency. Supported currencies: BTC, ETH' 
      });
    }

    const price = await cryptoService.getCryptoPrice(currency);
    const usdAmount = cryptoAmount * price;
    
    res.json({
      success: true,
      cryptoAmount,
      usdAmount,
      currency,
      price
    });
  } catch (error) {
    console.error('Error converting crypto to USD:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get supported cryptocurrencies
router.get('/currencies', async (req, res) => {
  try {
    const currencies = [
      { symbol: 'BTC', name: 'Bitcoin', id: '1' },
      { symbol: 'ETH', name: 'Ethereum', id: '1027' }
    ];
    
    res.json({
      success: true,
      currencies
    });
  } catch (error) {
    console.error('Error fetching currencies:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router; 