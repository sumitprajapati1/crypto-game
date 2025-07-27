import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketService from '../services/socketService';
import { getGameState, getGameHistory, placeBet as placeBetAPI } from '../services/apiService';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    status: 'waiting',
    roundId: null,
    multiplier: 1.0,
    timeRemaining: 0,
    players: 0,
    totalBet: 0
  });
  const [history, setHistory] = useState([]);
  const [bets, setBets] = useState([]);
  const [userBet, setUserBet] = useState(null);
  const [cashoutError, setCashoutError] = useState(null);

  // Defensive setGameState logic
  const safeSetGameState = (newState) => {
    setGameState(prev => {
      // If currently waiting and new state is running but has no roundId, ignore
      if (
        prev.status === 'waiting' &&
        newState.status === 'running' &&
        (!newState.roundId || newState.roundId === null)
      ) {
        return prev;
      }
      // If currently waiting and new state is running but roundId is not incremented, ignore
      if (
        prev.status === 'waiting' &&
        newState.status === 'running' &&
        prev.roundId && newState.roundId && newState.roundId <= prev.roundId
      ) {
        return prev;
      }
      return newState;
    });
  };

  useEffect(() => {
    // Fetch initial game state
    const fetchGameState = async () => {
      try {
        const { data } = await getGameState();
        if (data.game) {
          setGameState(data.game);
        }
        const historyRes = await getGameHistory();
        setHistory(historyRes.data.history);
      } catch (error) {
        console.error('Failed to fetch game state:', error);
      }
    };

    fetchGameState();

    // Setup WebSocket listeners
    SocketService.on('game_state', (data) => {
      console.log('Received game_state:', data);
      safeSetGameState(data);
    });

    SocketService.on('round_start', (data) => {
      console.log('Received round_start:', data);
      safeSetGameState({ ...data, status: 'running' });
    });

    SocketService.on('multiplier_update', (data) => {
      setGameState(prev => ({
        ...prev,
        multiplier: data.multiplier,
        timeRemaining: prev.timeRemaining - 0.1
      }));
    });

    SocketService.on('round_crash', (data) => {
      setGameState(prev => ({
        ...prev,
        status: 'crashed',
        crashPoint: data.crashPoint
      }));
    });

    SocketService.on('player_cashout', (data) => {
      setBets(prev => [...prev, {
        userId: data.userId,
        multiplier: data.multiplier,
        amount: data.payout
      }]);
    });

    SocketService.on('cashout_success', (data) => {
      setUserBet(prev => ({
        ...prev,
        status: 'cashed_out',
        cashoutMultiplier: data.multiplier
      }));
      setCashoutError(null);
    });

    SocketService.on('cashout_error', (data) => {
      setCashoutError(data.message);
    });

    SocketService.on('waiting', (data) => {
      console.log('Received waiting event in frontend:', data);
      setGameState(prev => ({
        ...prev,
        status: 'waiting',
        nextRoundIn: data.nextRoundIn || 3,
        multiplier: 1.0,
        crashPoint: null
      }));
      setUserBet(null);
      setBets([]);
    });

    // Connect to WebSocket
    SocketService.connect();

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const placeBet = async (userId, amount, currency) => {
    try {
      const { data } = await placeBetAPI(userId, amount, currency);
      setUserBet(data.bet);
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Cash out via WebSocket
  const cashOut = (userId) => {
    setCashoutError(null);
    SocketService.emit('cash_out', { userId });
  };

  return (
    <GameContext.Provider value={{
      gameState,
      history,
      bets,
      userBet,
      placeBet,
      cashOut,
      cashoutError
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);