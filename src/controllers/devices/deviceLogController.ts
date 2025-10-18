import { NextFunction, Request, Response } from 'express';
import { getAllDeviceLogByDeviceService } from '../../services/devices/deviceLogService';
import { sendSuccess } from '../../helper/response';

export const getAllDeviceLogByDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const deviceId = req.params.id;

  try {
    const logs = await getAllDeviceLogByDeviceService(deviceId);

    return sendSuccess(res, 200, 'Device logs fetched successfully', logs);
  } catch (error) {
    next(error);
  }
};
