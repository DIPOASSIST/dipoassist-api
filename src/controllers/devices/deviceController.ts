import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../helper/response';
import {
  createDeviceService,
  deleteDeviceService,
  getAllDeviceService,
  getDetailDeviceService,
  updateDeviceService,
} from '../../services/devices/deviceService';

export const getAllDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllDeviceService();

    return sendSuccess(res, 200, 'Devices fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getDetailDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deviceId = req.params.id;
    const data = await getDetailDeviceService(deviceId);

    return sendSuccess(res, 200, 'Device fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const createDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deviceData = req.body;
    const data = await createDeviceService(deviceData);

    return sendSuccess(res, 201, 'Device created successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updateDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deviceId = req.params.id;
    const deviceData = req.body;
    const data = await updateDeviceService(deviceId, deviceData);
    return sendSuccess(res, 200, 'Device updated successfully', data);
  } catch (error) {
    next(error);
  }
};

export const deleteDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deviceId = req.params.id;

    await deleteDeviceService(deviceId);
    return sendSuccess(res, 200, 'Device deleted successfully');
  } catch (error) {
    next(error);
  }
};
