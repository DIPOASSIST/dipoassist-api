import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { handleMessage } from '../../services/socket/wsService';

export const initWebSocket = (server: HTTPServer) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected!');

    ws.on('message', (message) => handleMessage(wss, message));

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};
