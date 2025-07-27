import gameService from '../services/gameService.js';

exports.placeBet = async (req, res) => {
  try {
    const { userId, amount, currency } = req.body;
    if (!userId || !amount || !['BTC', 'ETH'].includes(currency)) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    // Place bet (atomic, includes wallet deduction and transaction log)
    const bet = await gameService.placeBet(userId, amount, currency);
    res.json({
      success: true,
      bet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cashOut = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await gameService.cashOut(userId);
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCurrentGame = async (req, res) => {
  try {
    const game = await gameService.getCurrentGameState();
    res.json({
      success: true,
      game: game || { status: 'waiting' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};