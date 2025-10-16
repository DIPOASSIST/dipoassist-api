import WebSocket from 'ws';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { fcm } from '../../config/firebase';

const prisma = new PrismaClient();

interface FeatureData {
  features: any;
}

export const handleMessage = async (
  wsServer: WebSocket.Server,
  message: WebSocket.Data,
) => {
  try {
    const data: FeatureData = JSON.parse(message.toString());
    console.log('Data received:', data);

    const response = await axios.post(process.env.ML_API_URL!, {
      features: data.features,
    });
    const prediction = response.data;

    const result = response.data.predicted_label;

    console.log('Response from ML:', prediction);

    const urgentPhrase = await prisma.phrase.findFirst({
      where: {
        text: result,
        urgencies: {
          some: {
            is_urgent: true,
          },
        },
      },
      include: {
        urgencies: true,
      },
    });

    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ data, prediction }));
      }
    });

    if (urgentPhrase) {
      console.log('🚨 Urgent phrase detected:', urgentPhrase.text);

      const userId = urgentPhrase.urgencies[0].user_id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fcm_token: true, name: true },
      });

      console.log('User to notify:', user);

      if (user?.fcm_token) {
        await fcm.send({
          token: user.fcm_token,
          notification: {
            title: '🚨 Urgent Phrase Detected',
            body: `${user.name} mengucapkan kata "${urgentPhrase.text}"`,
          },
          android: {
            priority: 'high',
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
                alert: {
                  title: '🚨 Urgent Phrase Detected',
                  body: `${user.name} mengucapkan kata "${urgentPhrase.text}"`,
                },
              },
            },
          },
        });

        console.log('✅ Push notification sent');
      }
    }
  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
};
