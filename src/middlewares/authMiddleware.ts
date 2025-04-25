import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../types/auth/user';

interface AuthRequest extends Request {
  user?: Omit<User, 'password'>;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith('Bearer ')) {
    res.status(401).json({
      error: { message: 'Unauthorized: Missing or invalid token format' },
    });
    return;
  }

  const tokenWithoutBearer = token.split('Bearer ')[1];

  if (!tokenWithoutBearer) {
    res.status(401).json({
      error: { message: 'Unauthorized: Missing token value' },
    });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is not defined in environment variables');
    }

    const decodedToken = jwt.verify(tokenWithoutBearer, secret) as Omit<
      User,
      'password'
    >;

    req.user = decodedToken;

    return next();
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Unauthorized: Token verification failed',
        details: (error as Error).message,
      },
    });
    return;
  }
};

export const adminMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user || req.user.role !== 'admin') {
    res
      .status(403)
      .json({ error: { message: 'Forbidden: Admin access required' } });
    return;
  }
  next();
};
