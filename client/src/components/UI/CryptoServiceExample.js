import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import cryptoService from '../../services/cryptoService.js';

const CryptoServiceExample = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');
  const [usdAmount, setUsdAmount] = useState(100);
  const [cryptoAmount, setCryptoAmount] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updatePrice = async () => {
      if (selectedCurrency) {
        try {
          setLoading(true);
          const price = await cryptoService.getCryptoPrice(selectedCurrency);
          setCurrentPrice(price);
          
          // Calculate crypto amount
          if (usdAmount > 0) {
            const crypto = usdAmount / price;
            setCryptoAmount(crypto);
          }
        } catch (error) {
          console.error('Error fetching price:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    updatePrice();
  }, [selectedCurrency, usdAmount]);

  const handleConvertUsdToCrypto = async () => {
    try {
      setLoading(true);
      const result = await cryptoService.usdToCrypto(usdAmount, selectedCurrency);
      setConvertedAmount(result);
    } catch (error) {
      console.error('Error converting USD to crypto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertCryptoToUsd = async () => {
    try {
      setLoading(true);
      const result = await cryptoService.cryptoToUsd(cryptoAmount, selectedCurrency);
      setConvertedAmount(result);
    } catch (error) {
      console.error('Error converting crypto to USD:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCryptoAmount = (amount) => {
    return cryptoService.formatCryptoAmount(amount, selectedCurrency);
  };

  const formatUsdAmount = (amount) => {
    return cryptoService.formatUsdAmount(amount);
  };

  return (
    <Container>
      <Title>Crypto Service Usage Examples</Title>
      
      <Section>
        <h3>1. Get Current Crypto Price</h3>
        <PriceDisplay>
          <CurrencySelect
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {cryptoService.getSupportedCurrencies().map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </CurrencySelect>
          
          {currentPrice && (
            <PriceInfo>
              Current {selectedCurrency} Price: {formatUsdAmount(currentPrice)}
            </PriceInfo>
          )}
        </PriceDisplay>
      </Section>

      <Section>
        <h3>2. USD to Crypto Conversion</h3>
        <ConversionForm>
          <InputGroup>
            <label>USD Amount:</label>
            <input
              type="number"
              value={usdAmount}
              onChange={(e) => setUsdAmount(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
            />
          </InputGroup>
          
          <InputGroup>
            <label>Currency:</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              {cryptoService.getSupportedCurrencies().map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
          </InputGroup>
          
          {cryptoAmount > 0 && (
            <ResultDisplay>
              <span>≈ {formatCryptoAmount(cryptoAmount)} {selectedCurrency}</span>
            </ResultDisplay>
          )}
        </ConversionForm>
      </Section>

      <Section>
        <h3>3. Manual Conversion Methods</h3>
        <ButtonGroup>
          <Button onClick={handleConvertUsdToCrypto} disabled={loading}>
            Convert USD to {selectedCurrency}
          </Button>
          <Button onClick={handleConvertCryptoToUsd} disabled={loading}>
            Convert {selectedCurrency} to USD
          </Button>
        </ButtonGroup>
        
        {convertedAmount && (
          <ResultDisplay>
            <span>Converted Amount: {formatUsdAmount(convertedAmount)}</span>
          </ResultDisplay>
        )}
      </Section>

      <Section>
        <h3>4. Service Methods Available</h3>
        <MethodList>
          <MethodItem>
            <strong>getCryptoPrice(currency)</strong> - Get current price for a specific crypto
          </MethodItem>
          <MethodItem>
            <strong>getAllCryptoPrices()</strong> - Get prices for all supported cryptocurrencies
          </MethodItem>
          <MethodItem>
            <strong>usdToCrypto(usdAmount, currency)</strong> - Convert USD to crypto amount
          </MethodItem>
          <MethodItem>
            <strong>cryptoToUsd(cryptoAmount, currency)</strong> - Convert crypto to USD amount
          </MethodItem>
          <MethodItem>
            <strong>getWalletBalances(userId)</strong> - Get user's wallet balances with USD values
          </MethodItem>
          <MethodItem>
            <strong>getBalance(userId, currency)</strong> - Get balance for specific currency
          </MethodItem>
          <MethodItem>
            <strong>formatCryptoAmount(amount, currency)</strong> - Format crypto amount with proper decimals
          </MethodItem>
          <MethodItem>
            <strong>formatUsdAmount(amount)</strong> - Format USD amount with currency symbol
          </MethodItem>
          <MethodItem>
            <strong>getSupportedCurrencies()</strong> - Get array of supported cryptocurrencies
          </MethodItem>
        </MethodList>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  
  h3 {
    margin-top: 0;
    color: #2c3e50;
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CurrencySelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const PriceInfo = styled.div`
  font-weight: bold;
  color: #27ae60;
  font-size: 1.1rem;
`;

const ConversionForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-weight: 600;
    color: #2c3e50;
  }
  
  input, select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
`;

const ResultDisplay = styled.div`
  background: #e8f5e8;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #27ae60;
  margin-top: 1rem;
  
  span {
    font-weight: bold;
    color: #2c3e50;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #2980b9;
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const MethodList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MethodItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #ecf0f1;
  
  &:last-child {
    border-bottom: none;
  }
  
  strong {
    color: #3498db;
  }
`;

export default CryptoServiceExample; 