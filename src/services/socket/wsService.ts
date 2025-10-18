import WebSocket from 'ws';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { fcm } from '../../config/firebase';
import { Device } from '../../types/devices/device';
import { logDeviceEvent } from '../../utils/logger';

const prisma = new PrismaClient();

interface FeatureData {
  features: any;
}

export const handleMessage = async (
  wsServer: WebSocket.Server,
  message: WebSocket.Data,
  context: { device: Device },
) => {
  const device = context.device;

  try {
    const data: FeatureData = JSON.parse(message.toString());
    await logDeviceEvent(
      device.id,
      `📡 Data received: ${JSON.stringify(data).slice(0, 100)}`,
    );

    const response = await axios.post(process.env.ML_API_URL!, {
      features: data.features,
    });

    const prediction = response.data;
    const result = response.data.predicted_label;

    await logDeviceEvent(device.id, `🤖 ML Prediction: ${result}`);

    // 🔹 broadcast ke semua client user yg memiliki device ini
    wsServer.clients.forEach((client: any) => {
      if (
        client.readyState === WebSocket.OPEN &&
        client.type === 'user' &&
        client.userId === device.user_id
      ) {
        client.send(
          JSON.stringify({
            deviceId: device.id,
            data,
            prediction,
          }),
        );
      }
    });

    const urgentPhrase = await prisma.phrase.findFirst({
      where: {
        text: result,
        urgencies: { some: { is_urgent: true } },
      },
      include: { urgencies: true },
    });

    await prisma.history.create({
      data: {
        user_id: device.user_id,
        predicted_label: result,
      },
    });

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
            data: {
              urgent: 'true',
              phrase: urgentPhrase.text,
            },
          });

          await logDeviceEvent(
            device.id,
            `📱 Push notification sent to user: ${user.name}`,
          );
        }
      }
    }
  } catch (error: any) {
    await logDeviceEvent(
      device.id,
      `❌ Error processing message: ${error.message}`,
    );
    console.error('❌ Error processing message:', error);
  }
};
