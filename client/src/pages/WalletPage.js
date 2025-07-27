import React, { useState, useEffect, useContext } from 'react';
import { useWallet } from '../contexts';
import { Card, Table, Button, Input } from '../components/UI';
import styled from 'styled-components';

const WalletPage = ({ userId }) => {
  const { 
    balances, 
    transactions, 
    loading, 
    fetchWalletData, 
    deposit 
  } = useWallet();
  const [depositAmount, setDepositAmount] = useState(10);
  const [depositCurrency, setDepositCurrency] = useState('BTC');

  useEffect(() => {
    fetchWalletData(userId);
  }, [userId]);

  const handleDeposit = async () => {
    try {
      await deposit(userId, depositCurrency, depositAmount);
      alert('Funds added successfully!');
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  if (loading) {
    return <div>Loading wallet data...</div>;
  }

  return (
    <WalletContainer>
      <BalanceSection>
        <h2>Your Wallet</h2>
        <BalanceCards>
          <BalanceCard>
            <h3>BTC Balance</h3>
            <p>{balances.BTC.toFixed(8)} BTC</p>
            <p>${balances.BTC_USD.toFixed(2)}</p>
          </BalanceCard>
          <BalanceCard>
            <h3>ETH Balance</h3>
            <p>{balances.ETH.toFixed(8)} ETH</p>
            <p>${balances.ETH_USD.toFixed(2)}</p>
          </BalanceCard>
          <BalanceCard accent>
            <h3>Total Balance</h3>
            <p>${balances.total_USD.toFixed(2)}</p>
          </BalanceCard>
        </BalanceCards>
      </BalanceSection>

      <DepositSection>
        <h3>Add Funds (Demo)</h3>
        <DepositForm>
          <Input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
            min="1"
            step="1"
          />
          <select
            value={depositCurrency}
            onChange={(e) => setDepositCurrency(e.target.value)}
          >
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
          </select>
          <Button onClick={handleDeposit}>Add Funds</Button>
        </DepositForm>
      </DepositSection>

      <TransactionSection>
        <h3>Transaction History</h3>
        <Table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>USD Value</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{tx.type}</td>
                <td>{tx.cryptoAmount.toFixed(8)}</td>
                <td>{tx.currency}</td>
                <td>${tx.usdAmount.toFixed(2)}</td>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TransactionSection>
    </WalletContainer>
  );
};

const WalletContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const BalanceSection = styled(Card)`
  h2 {
    margin-bottom: 1.5rem;
  }
`;

const BalanceCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const BalanceCard = styled.div`
  padding: 1.5rem;
  border-radius: 8px;
  background-color: ${props => props.accent ? '#3498db' : '#f8f9fa'};
  color: ${props => props.accent ? 'white' : 'inherit'};
  
  h3 {
    margin-bottom: 1rem;
    color: ${props => props.accent ? 'white' : '#7f8c8d'};
  }
  
  p {
    font-size: 1.2rem;
    margin: 0.5rem 0;
    
    &:last-child {
      font-weight: bold;
      font-size: 1.5rem;
    }
  }
`;

const DepositSection = styled(Card)`
  h3 {
    margin-bottom: 1rem;
  }
`;

const DepositForm = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  input, select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  select {
    min-width: 80px;
  }
`;

const TransactionSection = styled(Card)`
  h3 {
    margin-bottom: 1rem;
  }
`;

export default WalletPage;