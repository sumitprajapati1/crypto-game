import React, { useState, useEffect } from 'react';
import { Input, Button } from '../UI';
import styled from 'styled-components';
import cryptoService from '../../services/cryptoService.js';

const BetForm = ({ 
  betAmount, 
  setBetAmount, 
  selectedCurrency, 
  setSelectedCurrency, 
  balance,
  onPlaceBet 
}) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCurrencies = async () => {
      const currencies = cryptoService.getSupportedCurrencies();
      setSupportedCurrencies(currencies);
    };
    loadCurrencies();
  }, []);

  useEffect(() => {
    const updatePrice = async () => {
      if (selectedCurrency) {
        try {
          setLoading(true);
          const price = await cryptoService.getCryptoPrice(selectedCurrency);
          setCurrentPrice(price);
          
          // Calculate crypto amount based on USD bet amount
          if (betAmount > 0) {
            const crypto = betAmount / price;
            setCryptoAmount(crypto);
          }
        } catch (error) {
          console.error(`Error fetching ${selectedCurrency} price:`, error);
        } finally {
          setLoading(false);
        }
      }
    };

    updatePrice();
  }, [selectedCurrency, betAmount]);

  const handleCurrencyChange = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    setCurrentPrice(null);
    setCryptoAmount(0);
  };

  const handleBetAmountChange = (value) => {
    setBetAmount(value);
    if (currentPrice && value > 0) {
      setCryptoAmount(value / currentPrice);
    }
  };

  const formatCryptoAmount = (amount) => {
    return cryptoService.formatCryptoAmount(amount, selectedCurrency);
  };

  const formatUsdAmount = (amount) => {
    return cryptoService.formatUsdAmount(amount);
  };

  return (
    <FormContainer>
      <FormGroup>
        <label>Bet Amount (USD)</label>
        <Input
          type="number"
          value={betAmount}
          onChange={(e) => handleBetAmountChange(parseFloat(e.target.value) || 0)}
          min="1"
          step="1"
          placeholder="Enter USD amount"
        />
        {currentPrice && betAmount > 0 && (
          <PriceInfo>
            ≈ {formatCryptoAmount(cryptoAmount)} {selectedCurrency}
          </PriceInfo>
        )}
      </FormGroup>
      
      <FormGroup>
        <label>Currency</label>
        <CurrencySelect
          value={selectedCurrency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          disabled={loading}
        >
          {supportedCurrencies.map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </CurrencySelect>
        {currentPrice && (
          <PriceInfo>
            Current Price: {formatUsdAmount(currentPrice)}
          </PriceInfo>
        )}
      </FormGroup>
      
      <FormGroup>
        <label>Available Balance</label>
        <BalanceInfo>
          <span>{formatCryptoAmount(balance)} {selectedCurrency}</span>
          <span>≈ {formatUsdAmount(balance * (currentPrice || 0))}</span>
        </BalanceInfo>
      </FormGroup>
      
      <Button 
        primary 
        onClick={onPlaceBet}
        disabled={betAmount <= 0 || loading}
      >
        {loading ? 'Loading...' : 'Place Bet'}
      </Button>
    </FormContainer>
  );
};

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }
`;

const CurrencySelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PriceInfo = styled.div`
  font-size: 0.85rem;
  color: #7f8c8d;
  font-style: italic;
  margin-top: 0.25rem;
`;

const BalanceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #e8f5e8;
  border-radius: 4px;
  border-left: 4px solid #27ae60;
  
  span {
    font-weight: 600;
    color: #2c3e50;
    
    &:last-child {
      color: #7f8c8d;
      font-size: 0.9rem;
    }
  }
`;

export default BetForm;