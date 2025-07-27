import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  getWalletBalance, 
  getTransactions,
  addFunds 
} from '../services/apiService';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balances, setBalances] = useState({
    BTC: 0,
    ETH: 0,
    BTC_USD: 0,
    ETH_USD: 0,
    total_USD: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWalletData = useCallback(async (userId) => {
    setLoading(true);
    try {
      const balanceRes = await getWalletBalance(userId);
      const txRes = await getTransactions(userId);
      
      // Server returns { success: true, balances: {...} }
      setBalances(balanceRes.data.balances);
      setTransactions(txRes.data.transactions);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const deposit = async (userId, currency, amount) => {
    try {
      const { data } = await addFunds(userId, currency, amount);
      await fetchWalletData(userId);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      balances,
      transactions,
      loading,
      fetchWalletData,
      deposit
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);