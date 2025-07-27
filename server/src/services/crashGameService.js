import crypto from 'crypto';
import GameRound from '../models/gameRound.js';

// Game configuration
const ROUND_INTERVAL = 10000; // 10 seconds per round
const MULTIPLIER_UPDATE_INTERVAL = 100; // 100ms
const GROWTH_FACTOR = 0.00006; // Exponential growth factor (tweak as needed)
const MAX_CRASH = 100; // Max crash multiplier

class CrashGameService {
  constructor() {
    this.currentRound = null;
    this.roundTimer = null;
    this.multiplierTimer = null;
    this.listeners = [];
    this.roundNumber = 0;
    this.waitingTimeout = null;
    this.nextRoundIn = null;
    this.isWaiting = false;
    // Single source of truth for state
    this.state = { status: 'waiting', nextRoundIn: 5 };
    this.startGameLoop();
  }

  // Start the main game loop
  startGameLoop() {
    this.startNewRound();
  }

  // Start a new round
  async startNewRound() {
    this.waitingTimeout = null;
    this.nextRoundIn = null;
    this.isWaiting = false;
    // Ensure unique roundId by checking the DB
    const lastRound = await GameRound.findOne().sort({ roundId: -1 });
    this.roundNumber = lastRound ? lastRound.roundId + 1 : 1;
    const seed = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(seed + this.roundNumber).digest('hex');
    const crashPoint = this.calculateCrashPoint(hash);
    const startTime = Date.now();

    this.currentRound = {
      roundId: this.roundNumber,
      seed,
      hash,
      crashPoint,
      startTime,
      bets: [],
      cashouts: [],
      ended: false,
      multiplier: 1,
    };

    // Update state to running
    this.state = {
      status: 'running',
      roundId: this.currentRound.roundId,
      multiplier: this.currentRound.multiplier,
      crashPoint: this.currentRound.crashPoint,
      startTime: this.currentRound.startTime,
      bets: [],
      cashouts: [],
    };

    // Save round to DB (initial state)
    await GameRound.create({
      roundId: this.roundNumber,
      seed,
      hash,
      crashPoint,
      startTime,
      bets: [],
      cashouts: [],
      ended: false,
    });

    this.notifyAll('round_start', this.getPublicRoundState());
    this.startMultiplierLoop();
  }

  // Multiplier progression loop
  startMultiplierLoop() {
    const startTime = this.currentRound.startTime;
    this.multiplierTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      // Exponential growth: multiplier = 1 + (elapsed * growth_factor)
      const multiplier = this.calculateMultiplier(elapsed);
      this.currentRound.multiplier = multiplier;
      // Update state multiplier
      this.state = {
        ...this.state,
        multiplier: multiplier
      };
      this.notifyAll('multiplier_update', { multiplier });
      if (multiplier >= this.currentRound.crashPoint) {
        this.endRound();
      }
    }, MULTIPLIER_UPDATE_INTERVAL);
  }

  // End the round at the crash point
  async endRound() {
    clearInterval(this.multiplierTimer);
    this.currentRound.ended = true;
    this.currentRound.endTime = Date.now();
    this.notifyAll('round_crash', {
      crashPoint: this.currentRound.crashPoint,
      roundId: this.currentRound.roundId,
    });
    // Update round in DB
    await GameRound.updateOne(
      { roundId: this.currentRound.roundId },
      { $set: { ended: true, endTime: this.currentRound.endTime } }
    );
    // Emit 'waiting' state for betting window
    this.nextRoundIn = 5;
    this.isWaiting = true;
    // Update state to waiting
    this.state = {
      status: 'waiting',
      nextRoundIn: this.nextRoundIn
    };
    this.waitingTimeout = setTimeout(() => {
      this.notifyAll('waiting', {
        status: 'waiting',
        nextRoundIn: this.nextRoundIn,
      });
      // Start next round after longer waiting period
      this.waitingTimeout = setTimeout(() => {
        this.waitingTimeout = null;
        this.nextRoundIn = null;
        this.isWaiting = false;
        this.startNewRound();
      }, this.nextRoundIn * 1000);
    }, 100);
  }

  // Provably fair crash point calculation
  calculateCrashPoint(hash) {
    // Use hash to generate a float between 0 and 1
    const hex = hash.slice(0, 16);
    const intVal = parseInt(hex, 16);
    const maxInt = Math.pow(2, 64);
    const rand = intVal / maxInt;
    // Avoid crash at 1.0 (simulate infinite multiplier)
    if (rand === 0) return MAX_CRASH;
    // Formula: crash = floor((1/(1-rand)), 2 decimals), capped at MAX_CRASH
    const crash = Math.min(Math.floor((1 / (1 - rand)) * 100) / 100, MAX_CRASH);
    return crash < 1 ? 1 : crash;
  }

  // Exponential multiplier progression
  calculateMultiplier(elapsedMs) {
    // Example: multiplier = 1 + (elapsed * growth_factor)
    // You can use a more complex exponential formula if desired
    return +(1 + elapsedMs * GROWTH_FACTOR).toFixed(2);
  }

  // Subscribe to game events
  on(event, listener) {
    this.listeners.push({ event, listener });
  }

  // Notify all listeners
  notifyAll(event, data) {
    for (const { event: evt, listener } of this.listeners) {
      if (evt === event) listener(data);
    }
  }

  // Get public round state (for clients)
  getPublicRoundState() {
    const { roundId, crashPoint, multiplier, ended, startTime } = this.currentRound;
    return { roundId, crashPoint, multiplier, ended, startTime };
  }
}

export default new CrashGameService(); 