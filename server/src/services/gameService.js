import crashGameService from './crashGameService.js';
import GameRound from '../models/gameRound.js';
import walletService from './walletService.js';
import cryptoService from './cryptoService.js';
import Transaction from '../models/transaction.js';
import mongoose from 'mongoose';

class GameService {
  // Place a bet in USD, convert to crypto, deduct from wallet, store in round
  async placeBet(userId, usdAmount, currency) {
    const round = crashGameService.currentRound;
    if (!round || round.ended) throw new Error('No active round');
    if (usdAmount <= 0) throw new Error('Bet amount must be positive');
    if (!['BTC', 'ETH'].includes(currency)) throw new Error('Invalid currency');
    
    // Get current crypto price
    const price = await cryptoService.getCryptoPrice(currency);
    const cryptoAmount = usdAmount / price;

    // Atomic wallet deduction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await walletService.deductFromBalance(userId, currency, cryptoAmount, session);
      // Create bet object
    const bet = {
      userId,
        amount: usdAmount,
      currency,
      cryptoAmount,
      priceAtBet: price,
        placedAt: new Date(),
        status: 'pending',
      transactionHash: `mock_tx_${Date.now()}`,
      };
      // Add bet to round in DB
      await GameRound.updateOne(
        { roundId: round.roundId },
        { $push: { bets: bet } },
        { session }
      );
      // Log transaction
      await Transaction.create([
        {
          userId,
          type: 'bet',
          currency,
          cryptoAmount,
          usdAmount,
          priceAtTime: price,
          transactionHash: bet.transactionHash,
          roundId: round.roundId,
          status: 'completed',
        }
      ], { session });
      await session.commitTransaction();
      session.endSession();
    return bet;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // Cash out during a round
  async cashOut(userId) {
    const round = crashGameService.currentRound;
    if (!round || round.ended) throw new Error('No active round');
    // Find user's bet
    const dbRound = await GameRound.findOne({ roundId: round.roundId });
    const bet = dbRound.bets.find(
      b => b.userId.toString() === userId.toString() && b.status === 'pending'
    );
    if (!bet) throw new Error('No active bet for this user');
    // Get current multiplier
    const multiplier = round.multiplier;
    // Calculate payout
    const payoutCrypto = bet.cryptoAmount * multiplier;
    const payoutUsd = payoutCrypto * bet.priceAtBet;
    const cashoutTime = new Date();
    const transactionHash = `mock_tx_cashout_${Date.now()}`;
    // Atomic wallet update
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // Update bet in round
      await GameRound.updateOne(
        { roundId: round.roundId, 'bets._id': bet._id },
        {
          $set: {
            'bets.$.cashoutMultiplier': multiplier,
            'bets.$.cashoutTime': cashoutTime,
            'bets.$.status': 'cashed_out',
            'bets.$.payoutCrypto': payoutCrypto,
            'bets.$.payoutUsd': payoutUsd,
            'bets.$.transactionHash': transactionHash,
          },
          $push: {
            cashouts: {
              userId,
              cashoutMultiplier: multiplier,
              cashoutTime,
              payoutCrypto,
              payoutUsd,
              transactionHash,
            }
          }
        },
        { session }
      );
      // Add payout to wallet
      await walletService.addToBalance(userId, bet.currency, payoutCrypto, session);
      // Log transaction
      await Transaction.create([
        {
          userId,
          type: 'cashout',
          currency: bet.currency,
          cryptoAmount: payoutCrypto,
          usdAmount: payoutUsd,
          priceAtTime: bet.priceAtBet,
          transactionHash,
          roundId: round.roundId,
          multiplier,
          status: 'completed',
        }
      ], { session });
      await session.commitTransaction();
      session.endSession();
      return {
        cryptoAmount: payoutCrypto,
        usdAmount: payoutUsd,
        multiplier,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  }

  // Get current round state
  async getCurrentGameState() {
    return crashGameService.state;
  }

  // Get game history
  async getGameHistory(limit = 10) {
    return GameRound.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');
  }
}

export default new GameService();