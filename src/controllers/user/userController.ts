import { NextFunction, Request, Response } from 'express';
import { sendError, sendSuccess } from '../../helper/response';
import {
  getAllUserService,
  getDetailUserService,
} from '../../services/user/userService';

export const getAllUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllUserService();

    return sendSuccess(res, 200, 'Users fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

export const getDetailUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getDetailUserService(req.params.id);

    if (!data) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};
