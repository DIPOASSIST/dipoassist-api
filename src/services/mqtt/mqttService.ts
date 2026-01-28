import mqtt from 'mqtt';
import WebSocket from 'ws';
import { PrismaClient } from '@prisma/client';
import { logDeviceEvent } from '../../utils/logger';
import { handleEmgPayload } from '../processing/processingService';

const prisma = new PrismaClient();

type InitMqttParams = {
  wsServer: WebSocket.Server;
};

export function initMqttSubscriber({ wsServer }: InitMqttParams) {
  const url = process.env.MQTT_URL || 'mqtt://localhost:1883';

  const client = mqtt.connect(url, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
    clean: true,
    reconnectPeriod: 1000,
    keepalive: 30,
  });

  client.on('connect', async () => {
    console.log('✅ MQTT connected');
    client.subscribe('dipoassist/device/+/emg', { qos: 1 });
    client.subscribe('dipoassist/device/+/status', { qos: 1 });
  });

  client.on('message', async (topic, payloadBuf) => {
    const payloadStr = payloadBuf.toString();

    try {
      const parts = topic.split('/');
      const deviceToken = parts[2];
      const tail = parts[3];

      if (!deviceToken) return;

      if (tail === 'status') {
        const status = JSON.parse(payloadStr) as {
          online: boolean;
          ts?: number;
        };

        const device = await prisma.device.findUnique({
          where: { device_token: deviceToken },
        });

        if (!device) return;

        await prisma.device.update({
          where: { id: device.id },
          data: { is_online: !!status.online },
        });

        await logDeviceEvent(
          device.id,
          `📶 MQTT status: ${status.online ? 'online' : 'offline'}`,
        );

        broadcastStatus(wsServer, device.id, deviceToken, !!status.online);
        return;
      }

      if (tail === 'emg') {
        const device = await prisma.device.findUnique({
          where: { device_token: deviceToken },
          include: { patient: true },
        });

        if (!device) {
          console.warn(`⚠️ Unknown device token on MQTT topic: ${deviceToken}`);
          return;
        }

        await handleEmgPayload(wsServer, payloadStr, device);
      }
    } catch (err: any) {
      console.error('❌ MQTT message error:', err?.message || err);
    }
  });

  client.on('reconnect', () => console.log('🔁 MQTT reconnecting...'));
  client.on('error', (err) => console.error('❌ MQTT error:', err));

  return client;
}

function broadcastStatus(
  wss: WebSocket.Server,
  deviceId: string,
  token: string,
  isOnline: boolean,
) {
  const payload = JSON.stringify({
    type: 'device_status',
    deviceId,
    token,
    isOnline,
  });

  wss.clients.forEach((client) => {
    const c = client as any;
    if (client.readyState !== WebSocket.OPEN) return;
    if (c.type === 'user') client.send(payload);
    if (c.type === 'device' && c.token === token) client.send(payload);
  });
}
