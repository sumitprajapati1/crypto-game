import walletService from '../services/walletService.js';
import cryptoService from '../services/cryptoService.js';
import User from '../models/user.js';

exports.getBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currency } = req.query;

    if (currency) {
      const balance = await walletService.getBalance(userId, currency);
      const price = await cryptoService.getCryptoPrice(currency);
      return res.json({
        cryptoBalance: balance,
        usdBalance: balance * price,
        currency
      });
    }

    const balances = await walletService.getBalances(userId);
    res.json(balances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({ username });
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFunds = async (req, res) => {
  try {
    const { userId, currency, amount } = req.body;
    
    if (!['BTC', 'ETH'].includes(currency)) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    const newBalance = await walletService.addToBalance(userId, currency, amount);
    const price = await cryptoService.getCryptoPrice(currency);

    res.json({
      success: true,
      cryptoBalance: newBalance,
      usdBalance: newBalance * price,
      currency
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};