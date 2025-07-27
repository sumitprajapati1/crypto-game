import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  BTC: { type: Number, default: 0 },
  ETH: { type: Number, default: 0 }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  wallet: { type: WalletSchema, default: () => ({}) }
});

export default mongoose.model('User', UserSchema);