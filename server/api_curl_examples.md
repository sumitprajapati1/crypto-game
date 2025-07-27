# API cURL Examples

## Auth Routes

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser"}'
```

### Get User Profile
```bash
curl http://localhost:3001/api/auth/profile/<userId>
```

---

## Game Routes

### Place a Bet
```bash
curl -X POST http://localhost:3001/api/game/bet \
  -H "Content-Type: application/json" \
  -d '{"userId": "<userId>", "amount": 100, "currency": "BTC"}'
```

### Cash Out
```bash
curl -X POST http://localhost:3001/api/game/cashout \
  -H "Content-Type: application/json" \
  -d '{"userId": "<userId>"}'
```

### Get Current Game State
```bash
curl http://localhost:3001/api/game/state
```

### Get Game History
```bash
curl http://localhost:3001/api/game/history?limit=10
```

---

## Wallet Routes

### Get Wallet Balance
```bash
curl http://localhost:3001/api/wallet/balance/<userId>?currency=BTC
```

### Deposit Funds
```bash
curl -X POST http://localhost:3001/api/wallet/deposit \
  -H "Content-Type: application/json" \
  -d '{"userId": "<userId>", "currency": "BTC", "amount": 0.01}'
```

### Get Transaction History
```bash
curl http://localhost:3001/api/wallet/transactions/<userId>?limit=20&type=deposit
```

---

## Crypto Routes

### Test Route
```bash
curl http://localhost:3001/api/crypto/test
```

### Get Crypto Price
```bash
curl http://localhost:3001/api/crypto/price/BTC
```

### Get All Crypto Prices
```bash
curl http://localhost:3001/api/crypto/prices
```

### Convert USD to Crypto
```bash
curl -X POST http://localhost:3001/api/crypto/convert/usd-to-crypto \
  -H "Content-Type: application/json" \
  -d '{"usdAmount": 100, "currency": "BTC"}'
```

### Convert Crypto to USD
```bash
curl -X POST http://localhost:3001/api/crypto/convert/crypto-to-usd \
  -H "Content-Type: application/json" \
  -d '{"cryptoAmount": 0.01, "currency": "BTC"}'
```

### Get Supported Currencies
```bash
curl http://localhost:3001/api/crypto/currencies
``` 