import { PrismaClient } from '@prisma/client';
import { DeviceType } from '../../validator/devices/device-validator';

const prisma = new PrismaClient();

export const getAllDeviceService = async () => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        nakes: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return devices;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching devices: ' + error.message);
    }
    throw new Error('Unknown error fetching devices');
  }
};

export const getDetailDeviceService = async (id: string) => {
  try {
    const device = await prisma.device.findUnique({
      where: {
        id,
      },
    });
    return device;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching device: ' + error.message);
    }
    throw new Error('Unknown error fetching device');
  }
};

export const createDeviceService = async (data: DeviceType) => {
  try {
    const device = await prisma.device.create({
      data: {
        user_id: data.user_id,
        medical_id: data.medical_id,
        name: data.name,
      },
    });
    return device;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating device: ' + error.message);
    }
    throw new Error('Unknown error creating device');
  }
};

export const updateDeviceService = async (id: string, data: DeviceType) => {
  try {
    const device = await prisma.device.update({
      where: { id },
      data: {
        user_id: data.user_id,
        medical_id: data.medical_id,
        name: data.name,
      },
    });
    return device;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating device: ' + error.message);
    }
    throw new Error('Unknown error updating device');
  }
};

export const deleteDeviceService = async (id: string) => {
  try {
    const device = await prisma.device.delete({
      where: { id },
    });
    return device;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting device: ' + error.message);
    }
    throw new Error('Unknown error deleting device');
  }
};
