import { Response } from 'express';

interface PaginationMeta {
  page: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = (
  res: Response,
  statusCode: number,
  message: string,
  data: unknown = null,
  pagination: PaginationMeta | null = null,
): void => {
  res.status(statusCode).json({
    meta: {
      status: 'success',
      statusCode,
      message,
    },
    data,
    ...(pagination && { pagination }),
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
