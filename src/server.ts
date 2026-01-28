import http from 'http';
import app from './app';
import { initWebSocket } from './controllers/socket/wsController';
import config from './config/config';
import { initMqttSubscriber } from './services/mqtt/mqttService';

const server = http.createServer(app);

const wss = initWebSocket(server);
initMqttSubscriber({ wsServer: wss });

server.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running on port ${config.port}`);
});
