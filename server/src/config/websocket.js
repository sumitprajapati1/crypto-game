import { WebSocketServer } from 'ws';
import crashGameService from '../services/crashGameService.js';
import { handleConnection } from '../controllers/wsController.js';

const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', handleConnection);

  // Broadcast helper
  function broadcast(message) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }

  // Subscribe to crash game events
  crashGameService.on('round_start', (data) => {
    broadcast(JSON.stringify({ event: 'round_start', data }));
  });
  crashGameService.on('multiplier_update', (data) => {
    broadcast(JSON.stringify({ event: 'multiplier_update', data }));
  });
  crashGameService.on('round_crash', (data) => {
    broadcast(JSON.stringify({ event: 'round_crash', data }));
  });

  // Player cashout event (to be triggered from GameService)
  wss.broadcastPlayerCashout = (userId, multiplier, payout) => {
    broadcast(JSON.stringify({
      event: 'player_cashout',
      data: { userId, multiplier, payout }
    }));
  };
};

export default setupWebSocket;