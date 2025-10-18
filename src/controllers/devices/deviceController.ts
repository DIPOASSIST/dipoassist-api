import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../../helper/response';
import {
  createDeviceService,
  deleteDeviceService,
  getAllDeviceByNakesService,
  getAllDeviceByUserService,
  getAllDeviceService,
  getDetailDeviceService,
  regenerateDeviceTokenService,
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

export const regenerateDeviceToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const deviceId = req.params.id;
    const data = await regenerateDeviceTokenService(deviceId);

    return sendSuccess(res, 200, 'Device token regenerated successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAllDeviceByNakes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const nakesId = req.user.id;
    const data = await getAllDeviceByNakesService(nakesId);

    return sendSuccess(res, 200, 'Devices fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAllDeviceByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.id;
    const data = await getAllDeviceByUserService(userId);

    return sendSuccess(res, 200, 'Devices fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAllDeviceByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const data = await getAllDeviceByUserService(userId);

    return sendSuccess(res, 200, 'Devices fetched successfully', data);
  } catch (error) {
    next(error);
  }
};
