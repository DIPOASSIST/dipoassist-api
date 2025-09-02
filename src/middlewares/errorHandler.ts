import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  details?: unknown;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    meta: {
      status: 'error',
      statusCode,
      message: err.message || 'Internal Server Error',
    },
    data: err.details || null,
  });
};
