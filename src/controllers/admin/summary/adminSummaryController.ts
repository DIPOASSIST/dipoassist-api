import { NextFunction, Request, Response } from 'express';
import {
  getCountActiveDevicesService,
  getCountDeviceInactiveService,
  getCountDevicesService,
} from '../../../services/devices/deviceService';
import { sendSuccess } from '../../../helper/response';
import { getCountUserService } from '../../../services/user/userService';

export const getAdminSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const [deviceCount, deviceActiveCount, deviceInactiveCount, userCount] =
      await Promise.all([
        getCountDevicesService(),
        getCountActiveDevicesService(),
        getCountDeviceInactiveService(),
        getCountUserService(),
      ]);

    const summary = {
      total_devices: deviceCount,
      active_devices: deviceActiveCount,
      inactive_devices: deviceInactiveCount,
      total_users: userCount,
    };

    return sendSuccess(res, 200, 'Admin summary fetched successfully', summary);
  } catch (error) {
    next(error);
  }
};
