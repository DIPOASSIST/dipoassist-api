import { NextFunction, Request, Response } from 'express';
import { User } from '../../types/auth/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { registerSchema } from '../../validator/auth/registerValidator';
import {
  changePasswordUserService,
  getUserByEmailService,
  getUserByIdService,
  registerUserService,
  requestResetPasswordService,
  resetPasswordService,
  verifyResetTokenService,
} from '../../services/auth/authService';
import { loginSchema } from '../../validator/auth/loginValidator';
import { sendError, sendSuccess } from '../../helper/response';
import { changePasswordSchema } from '../../validator/auth/changePasswordValidator';
import {
  confirmResetPasswordSchema,
  requestResetPasswordSchema,
} from '../../validator/auth/resetPasswordValidator';

export const withoutPasswordHandler = (user: User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    username: user.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
  });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // validate request body against the schema
    const data = registerSchema.parse(req.body);

    // check if user already exists
    const existingUser = await getUserByEmailService(data.email);

    if (existingUser) {
      return sendError(res, 409, 'Email is already registered');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await registerUserService({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(newUser);
    const userWithoutPassword = withoutPasswordHandler(newUser);

    return sendSuccess(res, 201, 'User successfully registered', {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await getUserByEmailService(data.email);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (user.role !== 'USER') {
      return sendError(res, 403, 'Access denied: Only user can login here');
    }

    const isPasswordValid = bcrypt.compareSync(data.password, user.password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid password');
    }

    const token = generateToken(user);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      id: user.id,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserFromWeb = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await getUserByEmailService(data.email);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    if (user.role !== 'ADMIN' && user.role !== 'NAKES') {
      return sendError(
        res,
        403,
        'Access denied: Only admin and nakes can login from web',
      );
    }

    const isPasswordValid = bcrypt.compareSync(data.password, user.password);

    if (!isPasswordValid) {
      return sendError(res, 401, 'Invalid password');
    }

    const token = generateToken(user);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      id: user.id,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuth = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const user = await getUserByIdService(req.user.id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { password, ...userWithoutPassword } = user;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userid = req.user.id;

    const parsed = changePasswordSchema.parse(req.body);

    await changePasswordUserService(userid, parsed);

    return sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

export const requestResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;
    const result = await requestResetPasswordService(email);
    return sendSuccess(res, 200, 'OTP sent successfully', result);
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { otp, email } = req.body;
    const result = await verifyResetTokenService(otp, email);
    return sendSuccess(res, 200, 'OTP verified successfully', result);
  } catch (error) {
    next(error);
  }
};

export const confirmResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { otp, newPassword, email } = req.body;
    const result = await resetPasswordService(otp, newPassword, email);
    return sendSuccess(res, 200, 'Password reset successfully', result);
  } catch (error) {
    next(error);
  }
};
