import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
): void => {
  res.status(statusCode).json({
    meta: {
      status: 'success',
      statusCode,
      message,
    },
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details: unknown = null,
): void => {
  res.status(statusCode).json({
    meta: {
      status: 'error',
      statusCode,
      message,
    },
    data: details,
  });
};
