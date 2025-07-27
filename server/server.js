import app from './app.js';
import http from 'http';
import setupWebSocket from './src/config/websocket.js';

const PORT = process.env.PORT || 5000;
console.log('DEBUG: PORT value is', PORT);

const server = http.createServer(app);
setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});