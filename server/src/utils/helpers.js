import crypto from 'crypto';

// Generate a mock transaction hash
export const generateMockHash = () => {
  return `mock_tx_${crypto.randomBytes(16).toString('hex')}`;
};

// Validate user input for bets
export const validateBetInput = (userId, amount, currency) => {
  if (!userId || !amount || !['BTC', 'ETH'].includes(currency)) {
    throw new Error('Invalid input: Missing required fields');
  }
  if (amount <= 0) {
    throw new Error('Invalid amount: Must be greater than 0');
  }
  if (typeof amount !== 'number') {
    throw new Error('Invalid amount: Must be a number');
  }
};

// Format game history for response
export const formatGameHistory = (rounds) => {
  return rounds.map(round => ({
    roundId: round.roundId,
    crashPoint: round.crashPoint,
    startTime: round.startTime,
    endTime: round.crashTime,
    status: round.status,
    bets: round.bets.map(bet => ({
      userId: bet.userId,
      amount: bet.amount,
      currency: bet.currency,
      cashoutMultiplier: bet.cashoutMultiplier,
      status: bet.status
    }))
  }));
};

// Calculate time remaining in current round
export const calculateTimeRemaining = (startTime, crashPoint, growthFactor) => {
  const elapsed = (Date.now() - startTime) / 1000;
  const totalDuration = (crashPoint - 1) / growthFactor;
  return Math.max(0, totalDuration - elapsed);
};