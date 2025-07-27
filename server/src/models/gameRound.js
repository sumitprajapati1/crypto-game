import mongoose from 'mongoose';

const BetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true }, // in USD
  currency: { type: String, enum: ['BTC', 'ETH'], required: true },
  cryptoAmount: { type: Number, required: true },
  priceAtBet: { type: Number, required: true }, // USD per crypto
  placedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'cashed_out', 'lost'],
    default: 'pending',
  },
  cashoutMultiplier: { type: Number },
  cashoutTime: { type: Date },
  payoutCrypto: { type: Number },
  payoutUsd: { type: Number },
  transactionHash: { type: String },
});

const CashoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cashoutMultiplier: { type: Number, required: true },
  cashoutTime: { type: Date, required: true },
  payoutCrypto: { type: Number, required: true },
  payoutUsd: { type: Number, required: true },
  transactionHash: { type: String, required: true },
});

const OutcomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  result: { type: String, enum: ['win', 'lose'], required: true },
  payoutCrypto: { type: Number },
  payoutUsd: { type: Number },
});

const GameRoundSchema = new mongoose.Schema({
  roundId: { type: Number, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  crashPoint: { type: Number },
  crashTime: { type: Date },
  seed: { type: String, required: true },
  hash: { type: String, required: true },
  status: {
    type: String,
    enum: ['waiting', 'running', 'crashed', 'settled'],
    default: 'waiting',
  },
  bets: [BetSchema],
  cashouts: [CashoutSchema],
  outcomes: [OutcomeSchema],
}, { timestamps: true });

export default mongoose.model('GameRound', GameRoundSchema);