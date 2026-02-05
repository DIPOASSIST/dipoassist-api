import WebSocket from 'ws';
import { userClients } from '../../controllers/socket/wsController';

interface FeatureData {
  features: any;
  ts: number;
  seq?: number;
}

export const handleMessage = (
  senderWs: WebSocket,
  message: WebSocket.Data,
  device: any,
) => {
  let data: FeatureData;

  try {
    data = JSON.parse(message.toString());
  } catch {
    return;
  }

  if (typeof data.ts !== 'number') return;

  const payload = JSON.stringify({
    deviceId: device.id,
    features: data.features,
    ts: data.ts,
    serverTs: Date.now(),
    seq: data.seq,
  });

  if (senderWs.readyState === WebSocket.OPEN) {
    senderWs.send(payload);
  }

  const userSockets = userClients.get(device.user_id);
  if (!userSockets) return;

  for (const ws of userSockets) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  }
};
