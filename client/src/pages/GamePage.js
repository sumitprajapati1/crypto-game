import React, { useState, useEffect, useContext } from 'react';
import { useGame, useWallet } from '../contexts';
import { Button, Card, ProgressBar, Table } from '../components/UI';
import BetForm from '../components/Game/BetForm';
import GameChart from '../components/Game/GameChart';
import styled from 'styled-components';

const GamePage = ({ userId }) => {
  const { 
    gameState, 
    history, 
    userBet, 
    placeBet, 
    cashOut 
  } = useGame();
  const { balances } = useWallet();
  const [countdown, setCountdown] = useState(10);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedCurrency, setSelectedCurrency] = useState('BTC');

  useEffect(() => {
    console.log('GamePage mounted');
    return () => {
      console.log('GamePage unmounted');
    };
  }, []);

  useEffect(() => {
    if (gameState.status === 'waiting') {
      // Use nextRoundIn from gameState if available
      setCountdown(gameState.nextRoundIn || 10);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState.status, gameState.nextRoundIn]);

  // Log gameState on every render
  useEffect(() => {
    console.log('GamePage render - gameState:', gameState);
  });

  const handlePlaceBet = async () => {
    try {
      await placeBet(userId, betAmount, selectedCurrency);
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  const handleCashOut = async () => {
    try {
      await cashOut(userId);
    } catch (error) {
      alert(error.response?.data?.error || error.message);
    }
  };

  return (
    <GameContainer>
      <GameSection>
        <GameHeader>
          <h2>Round #{gameState.roundId || '--'}</h2>
          <StatusBadge status={gameState.status}>
            {gameState.status.toUpperCase()}
          </StatusBadge>
        </GameHeader>

        {gameState.status === 'waiting' && (
          <>
            {console.log('Rendering BetForm because status is waiting')}
            <Countdown>
              Next round starts in: {countdown}s
            </Countdown>
            <BetForm
              betAmount={betAmount}
              setBetAmount={setBetAmount}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              balance={balances[selectedCurrency]}
              onPlaceBet={handlePlaceBet}
            />
          </>
        )}

        <MultiplierDisplay>
          {(gameState.multiplier || 1.0).toFixed(2)}x
        </MultiplierDisplay>

        <GameChart multiplier={gameState.multiplier} />

        {gameState.status === 'running' && userBet && (
          <CashOutSection>
            <p>Your bet: ${userBet.amount} ({(userBet.cryptoAmount || 0).toFixed(8)} {userBet.currency})</p>
            <Button 
              onClick={handleCashOut}
              disabled={userBet.status === 'cashed_out'}
            >
              {userBet.status === 'cashed_out' 
                ? `Cashed out at ${(userBet.cashoutMultiplier || 0).toFixed(2)}x` 
                : 'Cash Out'}
            </Button>
          </CashOutSection>
        )}
      </GameSection>

      <HistorySection>
        <h3>Previous Rounds</h3>
        <Table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Crash Point</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(round => (
              <tr key={round.roundId}>
                <td>#{round.roundId}</td>
                <td>{round.crashPoint ? `${(round.crashPoint || 0).toFixed(2)}x` : '--'}</td>
                <td>{round.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </HistorySection>
    </GameContainer>
  );
};

const GameContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  padding: 2rem;
`;

const GameSection = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  background-color: ${props => 
    props.status === 'waiting' ? '#f39c12' :
    props.status === 'running' ? '#2ecc71' :
    '#e74c3c'};
  color: white;
`;

const Countdown = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #7f8c8d;
`;

const MultiplierDisplay = styled.div`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  color: #2c3e50;
`;

const CashOutSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const HistorySection = styled(Card)`
  h3 {
    margin-bottom: 1rem;
  }
`;

export default GamePage;