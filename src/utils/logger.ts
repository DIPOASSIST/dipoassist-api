import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function logDeviceEvent(deviceId: string, message: string) {
  try {
    await prisma.deviceLog.create({
      data: { device_id: deviceId, message },
    });
    console.log(`📝 [${deviceId}] ${message}`);
  } catch (err) {
    console.error('❌ Failed to save log:', err);
  }
}
