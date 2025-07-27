import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import cryptoService from '../../services/cryptoService.js';

const BalanceCard = ({ title, cryptoAmount, usdAmount, currency, accent, userId }) => {
  const [currentPrice, setCurrentPrice] = useState(null);
  const [formattedCrypto, setFormattedCrypto] = useState('0');
  const [formattedUsd, setFormattedUsd] = useState('$0.00');

  useEffect(() => {
    const updatePrice = async () => {
      if (currency) {
        try {
          const price = await cryptoService.getCryptoPrice(currency);
          setCurrentPrice(price);
          
          // Format crypto amount
          const formatted = cryptoService.formatCryptoAmount(cryptoAmount, currency);
          setFormattedCrypto(formatted);
          
          // Format USD amount
          const formattedUsdAmount = cryptoService.formatUsdAmount(usdAmount);
          setFormattedUsd(formattedUsdAmount);
        } catch (error) {
          console.error(`Error updating ${currency} price:`, error);
        }
      }
    };

    updatePrice();
    
    // Update price every 30 seconds
    const interval = setInterval(updatePrice, 30000);
    
    return () => clearInterval(interval);
  }, [currency, cryptoAmount, usdAmount]);

  return (
    <CardContainer accent={accent}>
      <h3>{title}</h3>
      {currency && (
        <CryptoInfo>
          <p className="crypto-amount">{formattedCrypto} {currency}</p>
          {currentPrice && (
            <p className="current-price">@ ${currentPrice.toLocaleString()}</p>
          )}
        </CryptoInfo>
      )}
      <p className="usd-amount">{formattedUsd}</p>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
  background-color: ${props => props.accent ? '#3498db' : '#f8f9fa'};
  color: ${props => props.accent ? 'white' : 'inherit'};
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  }
  
  h3 {
    margin-bottom: 1rem;
    color: ${props => props.accent ? 'white' : '#7f8c8d'};
    font-size: 1.1rem;
  }
  
  .crypto-amount {
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }
  
  .current-price {
    font-size: 0.9rem;
    opacity: 0.8;
    margin: 0;
  }
  
  .usd-amount {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0.5rem 0 0 0;
  }
`;

const CryptoInfo = styled.div`
  margin: 0.5rem 0;
`;

export default BalanceCard;