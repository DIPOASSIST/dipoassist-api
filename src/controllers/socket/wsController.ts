import { Server as HTTPServer } from 'http';
import WebSocket from 'ws';
import { handleMessage } from '../../services/socket/wsService';
import { PrismaClient } from '@prisma/client';
import { logDeviceEvent } from '../../utils/logger';

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

        await prisma.device.update({
          where: { id: device.id },
          data: { is_online: true },
        });

        (ws as any).type = 'device';
        (ws as any).deviceId = device.id;
        (ws as any).userId = device.user_id;

        await logDeviceEvent(device.id, `✅ Device connected: ${device.name}`);

        broadcastStatus(wss, device.id, true);

        ws.on('message', (message) => {
          logDeviceEvent(
            device.id,
            `📩 Message received: ${message.toString().slice(0, 100)}`,
          );
          handleMessage(wss, message, { device });
        });

        ws.on('close', async () => {
          console.log(`🔌 Device disconnected: ${device.name}`);
          await prisma.device.update({
            where: { id: device.id },
            data: { is_online: false },
          });

          await logDeviceEvent(
            device.id,
            `❌ Device disconnected: ${device.name}`,
          );
          broadcastStatus(wss, device.id, false);
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

function broadcastStatus(
  wss: WebSocket.Server,
  deviceId: string,
  isOnline: boolean,
) {
  const payload = JSON.stringify({
    type: 'device_status',
    deviceId,
    isOnline,
  });

  wss.clients.forEach((client) => {
    if (
      (client as any).type === 'user' &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(payload);
    }
  });
}
