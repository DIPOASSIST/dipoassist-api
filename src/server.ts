import http from 'http';
import app from './app';
import { initWebSocket } from './controllers/socket/wsController';
import config from './config/config';

const server = http.createServer(app);

initWebSocket(server);

server.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
});
