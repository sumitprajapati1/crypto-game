import crypto from 'crypto';

function generateFairRandom() {
  // Generate a random seed
  const seed = crypto.randomBytes(32).toString('hex');
  
  // Create a hash of the seed (this would be revealed after the round ends)
  const hash = crypto.createHash('sha256').update(seed).digest('hex');
  
  return { seed, hash };
}

function calculateCrashPoint(seed, roundId) {
  // Combine seed and roundId for randomness
  const combined = seed + roundId.toString();
  const hash = crypto.createHash('sha256').update(combined).digest('hex');
  
  // Convert first 8 characters of hash to a number between 1 and 100
  const randomValue = parseInt(hash.substring(0, 8), 16) % 100;
  
  // Ensure minimum crash point of 1.1x and maximum of 100x
  const crashPoint = 1 + (randomValue / 100) * 99; // Range: 1.0 - 100.0
  return Math.max(1.1, crashPoint); // Ensure minimum of 1.1x
}

export { generateFairRandom, calculateCrashPoint };