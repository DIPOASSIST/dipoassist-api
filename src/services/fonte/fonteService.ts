import axios from 'axios';

export const sendWhatsapp = async (target: string, message: string) => {
  try {
    const token = process.env.FONNTE_API_KEY;
    const url = 'https://api.fonnte.com/send';

    const payload = {
      target: target.replace('+', ''),
      message,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };

    const response = await axios.post(url, payload, { headers });

    return response.data;
  } catch (error) {
    console.error('❌ Failed to send WA:', error);
    return null;
  }
};
