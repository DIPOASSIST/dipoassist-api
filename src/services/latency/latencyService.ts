import { Prisma, PrismaClient } from '@prisma/client';

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

export const getLatencyByDeviceService = async (
  deviceId: string,
  range: 'week' | 'month' | 'all' = 'week',
) => {
  try {
    const now = new Date();
    let startDate: Date | undefined;

    if (range === 'week') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (range === 'month') {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    }

    const whereClause: Prisma.LatencyLogWhereInput = {
      device_id: deviceId,
    };

    if (startDate) {
      whereClause.created_at = {
        gte: startDate,
        lte: now,
      };
    }

    const result = await prisma.latencyLog.findMany({
      where: whereClause,
      include: {
        device: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
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
