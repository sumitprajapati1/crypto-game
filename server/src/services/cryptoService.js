import axios from 'axios';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 10 }); // Cache prices for 10 seconds

class CryptoService {
  constructor() {
    this.apiUrl = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
    this.apiKey = process.env.COINMARKETCAP_API_KEY;
    this.symbolToId = {
      'BTC': '1',      // Bitcoin
      'ETH': '1027'    // Ethereum
    };
  }
  
  async getCryptoPrice(currency) {
    const cacheKey = `price_${currency}`;
    const cachedPrice = cache.get(cacheKey);
    
    if (cachedPrice) {
      return cachedPrice;
    }
    
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          id: this.symbolToId[currency]
        },
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
          'Accept': 'application/json'
        }
      });
      
      // Extract price from response
      const price = response.data.data[this.symbolToId[currency]].quote.USD.price;
      
      // Cache the price
      cache.set(cacheKey, price);
      return price;
    } catch (error) {
      console.error('Failed to fetch crypto price:', error.response?.data || error.message);
      
      // Fallback to cached price if available
      const lastPrice = cache.get(cacheKey);
      if (lastPrice) {
        console.log('Using cached price due to API error');
        return lastPrice;
      }
      
      // Default fallback prices if API fails and no cache
      const fallbackPrices = {
        'BTC': 50000,
        'ETH': 3000
      };
      console.log('Using fallback price due to API error');
      return fallbackPrices[currency];
    }
  }

  async getAllPrices() {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          id: Object.values(this.symbolToId).join(',')
        },
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey,
          'Accept': 'application/json'
        }
      });

      const prices = {};
      for (const [symbol, id] of Object.entries(this.symbolToId)) {
        prices[symbol] = response.data.data[id].quote.USD.price;
        cache.set(`price_${symbol}`, prices[symbol]);
      }

      return prices;
    } catch (error) {
      console.error('Failed to fetch all crypto prices:', error.response?.data || error.message);
      
      // Return cached prices if available
      const cachedPrices = {};
      for (const symbol of Object.keys(this.symbolToId)) {
        cachedPrices[symbol] = cache.get(`price_${symbol}`) || 
          (symbol === 'BTC' ? 50000 : 3000); // Fallback values
      }
      return cachedPrices;
    }
  }
}

export default new CryptoService();