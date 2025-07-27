import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import cryptoService from '../../services/cryptoService.js';

const CryptoPriceTracker = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const allPrices = await cryptoService.getAllCryptoPrices();
        setPrices(allPrices);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(fetchPrices, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return cryptoService.formatUsdAmount(price);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  return (
    <Container>
      <Header>
        <h3>Live Crypto Prices</h3>
        <LastUpdated>
          {lastUpdated && `Last updated: ${formatTime(lastUpdated)}`}
        </LastUpdated>
      </Header>
      
      {loading ? (
        <LoadingMessage>Loading prices...</LoadingMessage>
      ) : (
        <PriceGrid>
          {Object.entries(prices).map(([currency, price]) => (
            <PriceCard key={currency}>
              <CurrencySymbol>{currency}</CurrencySymbol>
              <PriceValue>{formatPrice(price)}</PriceValue>
              <CurrencyName>
                {currency === 'BTC' ? 'Bitcoin' : 'Ethereum'}
              </CurrencyName>
            </PriceCard>
          ))}
        </PriceGrid>
      )}
    </Container>
  );
};

const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 1rem 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1.2rem;
  }
`;

const LastUpdated = styled.span`
  font-size: 0.8rem;
  color: #7f8c8d;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
`;

const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PriceCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CurrencySymbol = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PriceValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CurrencyName = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

export default CryptoPriceTracker; 