import gameService from '../services/gameService.js';
import walletService from '../services/walletService.js';

export const handleConnection = (ws) => {
  // Send current game state to new connection
  gameService.getCurrentGameState().then((state) => {
    if (state) {
      ws.send(JSON.stringify({
        event: 'game_state',
        data: state
      }));
    }
  });

  ws.on('message', async (message) => {
    try {
      const { event, data } = JSON.parse(message);
      
      switch (event) {
        case 'cash_out':
          try {
            const result = await gameService.cashOut(data.userId);
            ws.send(JSON.stringify({
              event: 'cashout_success',
              data: result
            }));
            // Broadcast player cashout to all clients if broadcast function is available
            if (ws.server && ws.server.broadcastPlayerCashout) {
              ws.server.broadcastPlayerCashout(data.userId, result.multiplier, result.cryptoAmount);
            } else if (global.wss && global.wss.broadcastPlayerCashout) {
              global.wss.broadcastPlayerCashout(data.userId, result.multiplier, result.cryptoAmount);
            }
          } catch (error) {
            ws.send(JSON.stringify({
              event: 'cashout_error',
              data: { message: error.message }
            }));
          }
          break;

        case 'get_balance':
          try {
            const balances = await walletService.getBalances(data.userId);
            ws.send(JSON.stringify({
              event: 'balance_update',
              data: balances
            }));
          } catch (error) {
            ws.send(JSON.stringify({
              event: 'error',
              data: { message: error.message }
            }));
          }
          break;

        default:
          ws.send(JSON.stringify({
            event: 'error',
            data: { message: 'Unknown event' }
          }));
      }
    } catch (error) {
      ws.send(JSON.stringify({
        event: 'error',
        data: { message: 'Invalid message format' }
      }));
    }
  });
};