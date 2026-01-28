import WebSocket from 'ws';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { fcm } from '../../config/firebase';
import { logDeviceEvent } from '../../utils/logger';

const prisma = new PrismaClient();

interface FeatureData {
  ts?: number;
  features: any;
}

export async function handleEmgPayload(
  wsServer: WebSocket.Server,
  payloadStr: string,
  device: any,
) {
  const startTime = Date.now();

  try {
    const data: FeatureData = JSON.parse(payloadStr);
    const tParse = Date.now();

    await logDeviceEvent(
      device.id,
      `📡 MQTT EMG received: ${JSON.stringify(data).slice(0, 100)}`,
    );

    const mlStart = Date.now();
    const response = await axios.post(process.env.ML_API_URL!, {
      features: data.features,
    });
    const mlEnd = Date.now();
    const mlLatency = mlEnd - mlStart;

    const prediction = response.data;
    const result = response.data.predicted_label;

    await logDeviceEvent(
      device.id,
      `🤖 ML Prediction: ${result} (${mlLatency} ms)`,
    );

    const broadcastStart = Date.now();
    wsServer.clients.forEach((client: any) => {
      if (client.readyState !== WebSocket.OPEN) return;

      const isUserMatch =
        client.type === 'user' && client.userId === device.user_id;

      if (isUserMatch) {
        client.send(
          JSON.stringify({
            type: 'prediction',
            deviceId: device.id,
            ts: data.ts ?? Date.now(),
            data,
            prediction,
          }),
        );
      }
    });
    const broadcastEnd = Date.now();

    await prisma.history.create({
      data: {
        user_id: device.user_id,
        predicted_label: result,
        emg_signal: JSON.stringify(data.features),
      },
    });

    const urgentPhrase = await prisma.phrase.findFirst({
      where: {
        text: result,
        urgencies: { some: { is_urgent: true, user_id: device.user_id } },
      },
      include: { urgencies: true },
    });

    const notificationStart = Date.now();
    if (urgentPhrase && urgentPhrase.urgencies.length > 0) {
      await logDeviceEvent(device.id, `🚨 Urgent phrase detected: "${result}"`);

      for (const urgency of urgentPhrase.urgencies) {
        const user = await prisma.user.findUnique({
          where: { id: urgency.user_id },
          select: { fcm_token: true, name: true },
        });

        if (user?.fcm_token) {
          const title = '🚨 Urgent Phrase Detected';
          const body = `${user.name} mengucapkan kata "${urgentPhrase.text}"`;

          await fcm.send({
            token: user.fcm_token,
            notification: { title, body },
            android: {
              priority: 'high',
              notification: {
                sound: 'alert',
                channelId: 'high_importance_channel_alert',
              },
            },
            apns: {
              payload: {
                aps: {
                  alert: { title, body },
                  sound: 'alert.aiff',
                  contentAvailable: true,
                },
              },
            },
            data: { urgent: 'true', phrase: urgentPhrase.text },
          });

          await logDeviceEvent(
            device.id,
            `📱 Push notification sent to user: ${user.name}`,
          );
        }
      }
    }
    const notificationEnd = Date.now();

    // total latency
    const endTime = Date.now();
    const totalLatency = endTime - startTime;

    await prisma.latencyLog.createMany({
      data: [
        {
          device_id: device.id,
          type: 'ml',
          duration_ms: mlLatency,
          description: 'Latency of machine learning model prediction process',
        },
        {
          device_id: device.id,
          type: 'broadcast',
          duration_ms: broadcastEnd - broadcastStart,
          description:
            'Latency of broadcasting prediction result to connected user clients',
        },
        {
          device_id: device.id,
          type: 'notification',
          duration_ms: notificationEnd - notificationStart,
          description: 'Latency of sending FCM push notification to users',
        },
        {
          device_id: device.id,
          type: 'total',
          duration_ms: totalLatency,
          description:
            'Total processing time from MQTT → backend → ML → UI/notification',
        },
      ],
    });

    await logDeviceEvent(device.id, `⏱️ Total latency: ${totalLatency} ms`);
  } catch (error: any) {
    await logDeviceEvent(
      device.id,
      `❌ Error processing MQTT payload: ${error.message}`,
    );
    console.error('❌ Error processing MQTT payload:', error);
  }
}
