import { NextFunction, Request, Response } from 'express';
import { sendError, sendSuccess } from '../../helper/response';
import {
  getAllUserService,
  getDetailUserService,
  getUserNakesService,
  getUserRoleUserService,
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

export const getUserNakes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getUserNakesService();

    if (!data) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'Nakes fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

export const getUserRoleUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getUserRoleUserService();

    if (!data) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};
