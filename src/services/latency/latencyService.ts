import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllLatencyService = async ({
  page = 1,
}: {
  page?: number;
} = {}) => {
  try {
    const limit = 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.latencyLog.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          device: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.latencyLog.count(),
    ]);

    return {
      data,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
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
