import User from '../models/user.js';
import cryptoService from './cryptoService.js';

class WalletService {
  async getBalance(userId, currency) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user.wallet[currency] || 0;
  }
  
  async getBalances(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const btcPrice = await cryptoService.getCryptoPrice('BTC');
    const ethPrice = await cryptoService.getCryptoPrice('ETH');
    
    return {
      BTC: user.wallet.BTC || 0,
      ETH: user.wallet.ETH || 0,
      BTC_USD: (user.wallet.BTC || 0) * btcPrice,
      ETH_USD: (user.wallet.ETH || 0) * ethPrice,
      total_USD: (user.wallet.BTC || 0) * btcPrice + (user.wallet.ETH || 0) * ethPrice
    };
  }
  
  async addToBalance(userId, currency, amount) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    user.wallet[currency] = (user.wallet[currency] || 0) + amount;
    await user.save();
    
    return user.wallet[currency];
  }
  
  async deductFromBalance(userId, currency, amount) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    if ((user.wallet[currency] || 0) < amount) {
      throw new Error('Insufficient balance');
    }
    
    user.wallet[currency] -= amount;
    await user.save();
    
    return user.wallet[currency];
  }
}

export default new WalletService();