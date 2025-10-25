import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllLatencyService = async () => {
  try {
    const result = await prisma.latencyLog.findMany({
      include: {
        device: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching latencies: ' + error.message);
    }
    throw new Error('Unknown error fetching latencies');
  }
};

export const getLatencyByDeviceService = async (deviceId: string) => {
  try {
    const result = await prisma.latencyLog.findMany({
      where: { device_id: deviceId },
      include: {
        device: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching latencies by device: ' + error.message);
    }
    throw new Error('Unknown error fetching latencies by device');
  }
};
