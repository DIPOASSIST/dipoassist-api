import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/auth/user';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    res.status(401).json({
      meta: {
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Missing or invalid token format',
      },
      data: null,
    });
    return;
  }

  const tokenWithoutBearer = token.split('Bearer ')[1];

  if (!tokenWithoutBearer) {
    res.status(401).json({
      meta: {
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Missing token value',
      },
      data: null,
    });
    return;
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
    res.status(401).json({
      meta: {
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Token verification failed',
      },
      data: {
        details: (error as Error).message,
      },
    });
    return;
  }
};

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      meta: {
        status: 'error',
        statusCode: 403,
        message: 'Forbidden: Admin access required',
      },
      data: null,
    });
    return;
  }

  next();
};
