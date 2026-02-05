import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { PrismaClient } from '@prisma/client';
import { handleMessage } from '../../services/socket/wsService';

const prisma = new PrismaClient();

export const userClients = new Map<string, Set<WebSocket>>();
export const deviceClients = new Map<string, WebSocket>();

export const initWebSocket = (server: HTTPServer) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws, req) => {
    try {
      const params = new URLSearchParams(req.url?.split('?')[1]);
      const token = params.get('token');
      const userId = params.get('userId');

      if (!token && !userId) {
        ws.close(4001, 'Missing authentication');
        return;
      }

      // DEVICE CONNECTION
      if (token) {
        const device = await prisma.device.findUnique({
          where: { device_token: token },
          select: { id: true, user_id: true, name: true },
        });

        if (!device) {
          ws.close(4002, 'Invalid device token');
          return;
        }

        (ws as any).type = 'device';
        (ws as any).deviceId = device.id;
        (ws as any).userId = device.user_id;

        deviceClients.set(device.id, ws);

        console.log(`✅ Device connected ${device.id}`);

        ws.on('message', (msg) => {
          handleMessage(ws, msg, device);
        });

        ws.on('close', () => {
          deviceClients.delete(device.id);
          console.log(`❌ Device disconnected ${device.id}`);
        });

        return;
      }

      if (userId) {
        (ws as any).type = 'user';
        (ws as any).userId = userId;

        if (!userClients.has(userId)) {
          userClients.set(userId, new Set());
        }
        userClients.get(userId)!.add(ws);

        console.log(`👤 User connected ${userId}`);

        ws.on('close', () => {
          userClients.get(userId)?.delete(ws);
          console.log(`👋 User disconnected ${userId}`);
        });
      }
    } catch (err) {
      console.error('❌ WS error:', err);
      ws.close(1011);
    }
  });

  return wss;
};
