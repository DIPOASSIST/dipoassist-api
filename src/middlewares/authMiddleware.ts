import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/auth/user';
import { sendError } from '../helper/response';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized: Missing or invalid token format');
  }

  const tokenWithoutBearer = token.split('Bearer ')[1];

  if (!tokenWithoutBearer) {
    return sendError(res, 401, 'Unauthorized: Missing token value');
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined in environment variables');
    }

    const decodedToken = jwt.verify(tokenWithoutBearer, secret) as User;

    req.user = decodedToken;

    return next();
  } catch (error) {
    return sendError(res, 401, 'Unauthorized: Invalid or expired token');
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 403, 'Forbidden: Admin access required');
  }

  next();
};
