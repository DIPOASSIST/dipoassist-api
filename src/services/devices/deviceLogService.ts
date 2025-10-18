import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllDeviceLogByDeviceService = async (deviceId: string) => {
  try {
    const logs = await prisma.deviceLog.findMany({
      where: { device_id: deviceId },
      orderBy: { created_at: 'desc' },
      take: 100,
    });
    return logs;
  } catch (error) {
    console.error('Error fetching device logs:', error);
    throw new Error('Could not fetch device logs');
  }
};
