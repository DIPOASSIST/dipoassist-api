import { v4 as uuidv4 } from 'uuid';
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

export const getAllDeviceByUserService = async (userId: string) => {
  try {
    const devices = await prisma.device.findMany({
      where: {
        user_id: userId,
      },
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
      throw new Error('Error fetching devices by user: ' + error.message);
    }
    throw new Error('Unknown error fetching devices by user');
  }
};

export const getAllDeviceByNakesService = async (nakesId: string) => {
  try {
    const devices = await prisma.device.findMany({
      where: {
        medical_id: nakesId,
      },
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
      throw new Error('Error fetching devices by nakes: ' + error.message);
    }
    throw new Error('Unknown error fetching devices by nakes');
  }
};

export const getDetailDeviceService = async (id: string) => {
  try {
    const device = await prisma.device.findUnique({
      where: {
        id,
      },
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
        device_token: uuidv4(),
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

export const regenerateDeviceTokenService = async (id: string) => {
  try {
    const newToken = uuidv4();

    const updatedDevice = await prisma.device.update({
      where: { id },
      data: {
        device_token: newToken,
      },
      select: {
        id: true,
        name: true,
        device_token: true,
        updated_at: true,
      },
    });

    return updatedDevice;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error regenerating device token: ' + error.message);
    }
    throw new Error('Unknown error regenerating device token');
  }
};
