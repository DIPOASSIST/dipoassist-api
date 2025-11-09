import { NextFunction, Request, Response } from 'express';
import {
  getAllLatencyService,
  getLatencyByDeviceService,
} from '../../services/latency/latencyService';
import { sendSuccess } from '../../helper/response';

export const getAllLatency = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllLatencyService();

    return sendSuccess(res, 200, 'Latency logs fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getLatencyByDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deviceId = req.params.deviceId;
    const range = (req.query.range as 'week' | 'month' | 'all') || 'week';

    const data = await getLatencyByDeviceService(deviceId, range);

    return sendSuccess(res, 200, 'Latency logs fetched successfully', data);
  } catch (error) {
    next(error);
  }
};
