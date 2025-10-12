import { NextFunction, Request, Response } from 'express';
import { sendError, sendSuccess } from '../../helper/response';
import {
  createUserService,
  getAllUserService,
  getDetailUserService,
  getUserByNakesService,
  getUserNakesService,
  getUserRoleUserService,
  updateAccountService,
} from '../../services/user/userService';
import bcrypt from 'bcrypt';
import { getUserByEmailService } from '../../services/auth/authService';
import { withoutPasswordHandler } from '../auth/authController';

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

    return sendSuccess(res, 200, 'User fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

export const getUserByNakes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getUserByNakesService(req.user.id);

    return sendSuccess(res, 200, 'User fetched successfully', data);
  } catch (error) {
    return next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // validate request body against the schema
    const data = req.body;

    // check if user already exists
    const existingUser = await getUserByEmailService(data.email);

    if (existingUser) {
      return sendError(res, 409, 'Email is already registered');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await createUserService({
      ...data,
      password: hashedPassword,
    });

    const userWithoutPassword = withoutPasswordHandler(newUser);

    return sendSuccess(res, 201, 'User successfully registered', {
      user: userWithoutPassword,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.user.id;
    const { name, email, username, phone_number } = req.body;
    const image = req.file;

    const updatedUser = await updateAccountService({
      id,
      name,
      email,
      username,
      phone_number,
      image,
    });

    return sendSuccess(res, 200, 'Account updated successfully', updatedUser);
  } catch (error) {
    return next(error);
  }
};
