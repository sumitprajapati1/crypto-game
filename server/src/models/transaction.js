import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'bet', 'cashout', 'win'], 
    required: true 
  },
  currency: { 
    type: String, 
    enum: ['BTC', 'ETH'], 
    required: true 
  },
  cryptoAmount: { 
    type: Number, 
    required: true 
  },
  usdAmount: { 
    type: Number, 
    required: true 
  },
  priceAtTime: { 
    type: Number, 
    required: true 
  },
  transactionHash: { 
    type: String, 
    required: true 
  },
  roundId: { 
    type: Number 
  },
  multiplier: { 
    type: Number 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'completed' 
  }
}, { timestamps: true });

export default mongoose.model('Transaction', TransactionSchema);