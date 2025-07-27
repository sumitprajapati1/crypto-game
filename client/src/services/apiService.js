import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (username) => {
  return api.post('/auth/register', { username });
};

export const getUserProfile = async (userId) => {
  return api.get(`/auth/profile/${userId}`);
};

export const placeBet = async (userId, amount, currency) => {
  return api.post('/game/bet', { userId, amount, currency });
};

export const cashOut = async (userId) => {
  return api.post('/game/cashout', { userId });
};

export const getGameState = async () => {
  return api.get('/game/state');
};

export const getGameHistory = async (limit = 10) => {
  return api.get(`/game/history?limit=${limit}`);
};

export const getWalletBalance = async (userId) => {
  return api.get(`/wallet/balance/${userId}`);
};

export const getTransactions = async (userId, limit = 20) => {
  return api.get(`/wallet/transactions/${userId}?limit=${limit}`);
};

export const addFunds = async (userId, currency, amount) => {
  return api.post('/wallet/deposit', { userId, currency, amount });
};