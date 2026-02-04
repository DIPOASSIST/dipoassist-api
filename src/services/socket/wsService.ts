import WebSocket from 'ws';

interface FeatureData {
  features: any;
  ts: number;
  seq?: number;
}

export const handleMessage = async (
  wsServer: WebSocket.Server,
  senderWs: WebSocket,
  message: WebSocket.Data,
  context: { device: any; req: any },
) => {
  try {
    const data: FeatureData = JSON.parse(message.toString());
    if (typeof data.ts !== 'number') return;

    const sender = senderWs as any;
    const virtualDeviceId = String(sender.virtualDeviceId ?? context.device.id);

    const payload = JSON.stringify({
      deviceId: virtualDeviceId,
      features: data.features,
      ts: data.ts,
      serverTs: Date.now(),
      seq: data.seq,
    });

    if (senderWs.readyState === WebSocket.OPEN) {
      senderWs.send(payload);
    }

    wsServer.clients.forEach((client) => {
      const c = client as any;
      if (client === senderWs) return;
      if (client.readyState !== WebSocket.OPEN) return;

      const isUserMatch =
        c.type === 'user' && c.userId === context.device.user_id;
      if (isUserMatch) client.send(payload);
    });
  } catch (error: any) {
    console.error('❌ Error processing message:', error.message);
  }
};
