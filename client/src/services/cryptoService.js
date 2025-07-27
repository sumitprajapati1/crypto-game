import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class CryptoService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get current price for a specific cryptocurrency
   * @param {string} currency - The cryptocurrency symbol (BTC, ETH)
   * @returns {Promise<number>} - The current price in USD
   */
  async getCryptoPrice(currency) {
    try {
      const response = await this.api.get(`/crypto/price/${currency}`);
      return response.data.price;
    } catch (error) {
      console.error(`Failed to fetch ${currency} price:`, error);
      // Return fallback prices if API fails
      const fallbackPrices = {
        'BTC': 50000,
        'ETH': 3000
      };
      return fallbackPrices[currency] || 0;
    }
  }

  /**
   * Get current prices for all supported cryptocurrencies
   * @returns {Promise<Object>} - Object with currency symbols as keys and prices as values
   */
  async getAllCryptoPrices() {
    try {
      const response = await this.api.get('/crypto/prices');
      return response.data.prices;
    } catch (error) {
      console.error('Failed to fetch crypto prices:', error);
      // Return fallback prices if API fails
      return {
        'BTC': 50000,
        'ETH': 3000
      };
    }
  }

  /**
   * Convert USD amount to crypto amount
   * @param {number} usdAmount - Amount in USD
   * @param {string} currency - Cryptocurrency symbol
   * @returns {Promise<number>} - Amount in crypto
   */
  async usdToCrypto(usdAmount, currency) {
    const price = await this.getCryptoPrice(currency);
    return usdAmount / price;
  }

  /**
   * Convert crypto amount to USD
   * @param {number} cryptoAmount - Amount in crypto
   * @param {string} currency - Cryptocurrency symbol
   * @returns {Promise<number>} - Amount in USD
   */
  async cryptoToUsd(cryptoAmount, currency) {
    const price = await this.getCryptoPrice(currency);
    return cryptoAmount * price;
  }

  /**
   * Get wallet balance with current prices
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Wallet balances with USD values
   */
  async getWalletBalances(userId) {
    try {
      const response = await this.api.get(`/wallet/balance/${userId}`);
      return response.data.balances;
    } catch (error) {
      console.error('Failed to fetch wallet balances:', error);
      return {
        BTC: 0,
        ETH: 0,
        BTC_USD: 0,
        ETH_USD: 0,
        total_USD: 0
      };
    }
  }

  /**
   * Get balance for specific currency
   * @param {string} userId - User ID
   * @param {string} currency - Cryptocurrency symbol
   * @returns {Promise<Object>} - Balance object with crypto and USD values
   */
  async getBalance(userId, currency) {
    try {
      const response = await this.api.get(`/wallet/balance/${userId}?currency=${currency}`);
      return response.data.balance;
    } catch (error) {
      console.error(`Failed to fetch ${currency} balance:`, error);
      return {
        crypto: 0,
        usd: 0,
        currency
      };
    }
  }

  /**
   * Format crypto amount with appropriate decimals
   * @param {number} amount - The amount to format
   * @param {string} currency - The cryptocurrency symbol
   * @returns {string} - Formatted amount string
   */
  formatCryptoAmount(amount, currency) {
    if (!amount || isNaN(amount)) return '0';
    
    const decimals = currency === 'BTC' ? 8 : 6;
    return parseFloat(amount).toFixed(decimals);
  }

  /**
   * Format USD amount
   * @param {number} amount - The amount to format
   * @returns {string} - Formatted USD amount string
   */
  formatUsdAmount(amount) {
    if (!amount || isNaN(amount)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Get supported cryptocurrencies
   * @returns {Array} - Array of supported cryptocurrency symbols
   */
  getSupportedCurrencies() {
    return ['BTC', 'ETH'];
  }
}

export default new CryptoService(); 