import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { handleMessage } from '../../services/socket/wsService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initWebSocket = (server: HTTPServer) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws, req) => {
    try {
      const params = new URLSearchParams(req.url?.split('?')[1]);
      const token = params.get('token');
      const userId = params.get('userId');

      if (!token && !userId) {
        ws.close(4001, 'Missing authentication token or userId');
        return;
      }

      if (token) {
        const device = await prisma.device.findUnique({
          where: { device_token: token },
          include: { patient: true },
        });

        if (!device) {
          ws.close(4002, 'Invalid device token');
          return;
        }

        (ws as any).type = 'device';
        (ws as any).deviceId = device.id;
        (ws as any).userId = device.user_id;

        console.log(`✅ Device connected: ${device.name} (${device.id})`);

        ws.on('message', (message) => handleMessage(wss, message, { device }));

        ws.on('close', () => {
          console.log(`🔌 Device disconnected: ${device.name}`);
        });

        return;
      }

      if (userId) {
        (ws as any).type = 'user';
        (ws as any).userId = userId;
        console.log(`👤 User connected: ${userId}`);

        ws.on('close', () => {
          console.log(`👋 User disconnected: ${userId}`);
        });
      }
    } catch (err) {
      console.error('❌ Error establishing connection:', err);
      ws.close(1011, 'Internal server error');
    }
  });

  return wss;
};
