# Crypto Service - Frontend Usage Guide

The `cryptoService.js` provides a comprehensive interface for handling cryptocurrency operations in the frontend. It communicates with the backend API to fetch real-time prices and perform conversions.

## Installation

The crypto service is already included in the project. Import it in your components:

```javascript
import cryptoService from '../../services/cryptoService.js';
```

## Available Methods

### 1. Price Fetching

#### `getCryptoPrice(currency)`
Get the current price for a specific cryptocurrency.

```javascript
// Get Bitcoin price
const btcPrice = await cryptoService.getCryptoPrice('BTC');
console.log(`Bitcoin price: $${btcPrice}`);

// Get Ethereum price
const ethPrice = await cryptoService.getCryptoPrice('ETH');
console.log(`Ethereum price: $${ethPrice}`);
```

#### `getAllCryptoPrices()`
Get current prices for all supported cryptocurrencies.

```javascript
const prices = await cryptoService.getAllCryptoPrices();
console.log(prices); // { BTC: 50000, ETH: 3000 }
```

### 2. Currency Conversion

#### `usdToCrypto(usdAmount, currency)`
Convert USD amount to cryptocurrency amount.

```javascript
const cryptoAmount = await cryptoService.usdToCrypto(100, 'BTC');
console.log(`$100 = ${cryptoAmount} BTC`);
```

#### `cryptoToUsd(cryptoAmount, currency)`
Convert cryptocurrency amount to USD.

```javascript
const usdAmount = await cryptoService.cryptoToUsd(0.002, 'BTC');
console.log(`0.002 BTC = $${usdAmount}`);
```

### 3. Wallet Operations

#### `getWalletBalances(userId)`
Get user's wallet balances with USD values.

```javascript
const balances = await cryptoService.getWalletBalances('user123');
console.log(balances);
// {
//   BTC: 0.01,
//   ETH: 0.1,
//   BTC_USD: 500,
//   ETH_USD: 300,
//   total_USD: 800
// }
```

#### `getBalance(userId, currency)`
Get balance for a specific currency.

```javascript
const balance = await cryptoService.getBalance('user123', 'BTC');
console.log(balance);
// {
//   crypto: 0.01,
//   usd: 500,
//   currency: 'BTC'
// }
```

### 4. Formatting Utilities

#### `formatCryptoAmount(amount, currency)`
Format crypto amount with appropriate decimals.

```javascript
const formatted = cryptoService.formatCryptoAmount(0.12345678, 'BTC');
console.log(formatted); // "0.12345678"

const formattedEth = cryptoService.formatCryptoAmount(1.234567, 'ETH');
console.log(formattedEth); // "1.234567"
```

#### `formatUsdAmount(amount)`
Format USD amount with currency symbol.

```javascript
const formatted = cryptoService.formatUsdAmount(1234.56);
console.log(formatted); // "$1,234.56"
```

### 5. Utility Methods

#### `getSupportedCurrencies()`
Get array of supported cryptocurrencies.

```javascript
const currencies = cryptoService.getSupportedCurrencies();
console.log(currencies); // ['BTC', 'ETH']
```

## Usage Examples

### Basic Price Display Component

```javascript
import React, { useState, useEffect } from 'react';
import cryptoService from '../../services/cryptoService.js';

const PriceDisplay = ({ currency }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const currentPrice = await cryptoService.getCryptoPrice(currency);
        setPrice(currentPrice);
      } catch (error) {
        console.error('Error fetching price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [currency]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>{currency} Price</h3>
      <p>{cryptoService.formatUsdAmount(price)}</p>
    </div>
  );
};
```

### Real-time Price Tracker

```javascript
import React, { useState, useEffect } from 'react';
import cryptoService from '../../services/cryptoService.js';

const PriceTracker = () => {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        const allPrices = await cryptoService.getAllCryptoPrices();
        setPrices(allPrices);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    };

    updatePrices();
    
    // Update every 30 seconds
    const interval = setInterval(updatePrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Live Crypto Prices</h2>
      {lastUpdated && <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>}
      
      {Object.entries(prices).map(([currency, price]) => (
        <div key={currency}>
          <strong>{currency}:</strong> {cryptoService.formatUsdAmount(price)}
        </div>
      ))}
    </div>
  );
};
```

### Conversion Calculator

```javascript
import React, { useState, useEffect } from 'react';
import cryptoService from '../../services/cryptoService.js';

const ConversionCalculator = () => {
  const [usdAmount, setUsdAmount] = useState(100);
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [cryptoAmount, setCryptoAmount] = useState(0);

  useEffect(() => {
    const convert = async () => {
      if (usdAmount > 0) {
        const converted = await cryptoService.usdToCrypto(usdAmount, selectedCurrency);
        setCryptoAmount(converted);
      }
    };

    convert();
  }, [usdAmount, selectedCurrency]);

  return (
    <div>
      <h3>USD to Crypto Converter</h3>
      
      <div>
        <label>USD Amount:</label>
        <input
          type="number"
          value={usdAmount}
          onChange={(e) => setUsdAmount(parseFloat(e.target.value) || 0)}
        />
      </div>
      
      <div>
        <label>Currency:</label>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          {cryptoService.getSupportedCurrencies().map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      
      {cryptoAmount > 0 && (
        <div>
          <strong>Result:</strong> {cryptoService.formatCryptoAmount(cryptoAmount, selectedCurrency)} {selectedCurrency}
        </div>
      )}
    </div>
  );
};
```

## Error Handling

The service includes built-in error handling with fallback values:

- If API calls fail, it returns cached prices or fallback values
- All methods return sensible defaults when errors occur
- Console errors are logged for debugging

## Backend API Endpoints

The frontend crypto service communicates with these backend endpoints:

- `GET /api/crypto/price/:currency` - Get price for specific currency
- `GET /api/crypto/prices` - Get all crypto prices
- `POST /api/crypto/convert/usd-to-crypto` - Convert USD to crypto
- `POST /api/crypto/convert/crypto-to-usd` - Convert crypto to USD
- `GET /api/crypto/currencies` - Get supported currencies

## Best Practices

1. **Caching**: The service automatically caches prices for 10 seconds
2. **Error Handling**: Always wrap calls in try-catch blocks
3. **Loading States**: Show loading indicators during API calls
4. **Real-time Updates**: Use intervals for live price updates
5. **Formatting**: Use the built-in formatting methods for consistent display

## Components Using Crypto Service

- `BalanceCard.js` - Displays wallet balances with real-time prices
- `BetForm.js` - Shows price conversions during betting
- `CryptoPriceTracker.js` - Live price display component
- `CryptoServiceExample.js` - Comprehensive usage examples 