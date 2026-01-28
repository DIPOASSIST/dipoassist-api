import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';

export const initWebSocket = (server: HTTPServer) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws, req) => {
    try {
      const params = new URLSearchParams(req.url?.split('?')[1]);
      const userId = params.get('userId');

      if (!userId) {
        ws.close(4001, 'Missing userId');
        return;
      }

      (ws as any).type = 'user';
      (ws as any).userId = userId;

      console.log(`👤 User connected: ${userId}`);

      ws.on('close', () => {
        console.log(`👋 User disconnected: ${userId}`);
      });
    } catch (err) {
      console.error('❌ Error establishing connection:', err);
      ws.close(1011, 'Internal server error');
    }
  });

  return wss;
};
