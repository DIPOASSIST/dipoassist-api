import WebSocket from 'ws';
import axios from 'axios';

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

    console.log('Response from ML:', prediction);

    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ data, prediction }));
      }
    });
  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
};
