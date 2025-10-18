import WebSocket from 'ws';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { fcm } from '../../config/firebase';
import { Device } from '../../types/devices/device';

const prisma = new PrismaClient();

interface FeatureData {
  features: any;
}

export const handleMessage = async (
  wsServer: WebSocket.Server,
  message: WebSocket.Data,
  context: { device: Device },
) => {
  try {
    const device = context.device;
    const data: FeatureData = JSON.parse(message.toString());

    console.log('Data received:', data);

    const response = await axios.post(process.env.ML_API_URL!, {
      features: data.features,
    });

    const prediction = response.data;
    const result = response.data.predicted_label;

    console.log('Response from ML:', prediction);

    // broadcast to client who have a this device
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

    const history = await prisma.history.create({
      data: {
        user_id: device.user_id,
        predicted_label: result,
      },
    });

    if (urgentPhrase && urgentPhrase.urgencies.length > 0) {
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

          console.log(
            '✅ Push notification sent with custom alert sound to user:',
            user.name,
          );
        }
      }
    }
  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
};
