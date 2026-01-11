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
    const page = req.query.page ? Number(req.query.page) : 1;

    const { data, total, totalPages } = await getAllLatencyService({ page });

    return sendSuccess(res, 200, 'Latency logs fetched successfully', data, {
      page,
      total,
      totalPages,
    });
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
    const page = req.query.page ? Number(req.query.page) : 1;

    const { data, total, totalPages } = await getLatencyByDeviceService(
      deviceId,
      range,
      page,
    );

    return sendSuccess(res, 200, 'Latency logs fetched successfully', data, {
      page,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};
