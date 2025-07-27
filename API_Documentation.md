# API cURL Examples

## Auth Routes

<!-- ### Register User
```bash
curl -X POST https://crypto-game-30tf.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

### Get User Profile
```bash
curl https://crypto-game-30tf.onrender.com/api/auth/profile/68867c8e7bcde11804020af7
``` -->

---

## Wallet Routes

### Get Wallet Balance
```bash
curl https://crypto-game-30tf.onrender.com/api/wallet/balance/68867c8e7bcde11804020af7?currency=BTC
```

### Deposit Funds
```bash
curl -X POST https://crypto-game-30tf.onrender.com/api/wallet/deposit \
  -H "Content-Type: application/json" \
  -d '{"userId": "68867c8e7bcde11804020af7", "currency": "BTC", "amount": 0.01}'
```

### Get Transaction History
```bash
curl https://crypto-game-30tf.onrender.com/api/wallet/transactions/68867c8e7bcde11804020af7?limit=20&type=deposit
```

---

---

## Game Routes

### Place a Bet
```bash
curl -X POST https://crypto-game-30tf.onrender.com/api/game/bet \
  -H "Content-Type: application/json" \
  -d '{"userId": "68867c8e7bcde11804020af7", "amount": 100, "currency": "BTC"}'
```

### Cash Out
```bash
curl -X POST https://crypto-game-30tf.onrender.com/api/game/cashout \
  -H "Content-Type: application/json" \
  -d '{"userId": "68867c8e7bcde11804020af7"}'
```

### Get Current Game State
```bash
curl https://crypto-game-30tf.onrender.com/api/game/state
```

### Get Game History
```bash
curl https://crypto-game-30tf.onrender.com/api/game/history?limit=10
```

## Crypto Routes

### Test Route
```bash
curl https://crypto-game-30tf.onrender.com/api/crypto/test
```

### Get Crypto Price
```bash
curl https://crypto-game-30tf.onrender.com/api/crypto/price/BTC
```

### Get All Crypto Prices
```bash
curl https://crypto-game-30tf.onrender.com/api/crypto/prices
```

### Convert USD to Crypto
```bash
curl -X POST http://localhost:3001/api/crypto/convert/usd-to-crypto \
  -H "Content-Type: application/json" \
  -d '{"usdAmount": 100, "currency": "BTC"}'
```

### Convert Crypto to USD
```bash
curl -X POST https://crypto-game-30tf.onrender.com/api/crypto/convert/crypto-to-usd \
  -H "Content-Type: application/json" \
  -d '{"cryptoAmount": 0.01, "currency": "BTC"}'
```

### Get Supported Currencies
```bash
curl https://crypto-game-30tf.onrender.com/api/crypto/currencies
``` 
