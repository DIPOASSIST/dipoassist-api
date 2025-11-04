import { Request, Response } from 'express';
import {
  getAllHistoryService,
  getDetailHistoryService,
} from '../../services/history/historyService';
import { sendSuccess } from '../../helper/response';

export const getAllHistory = async (
  req: Request,
  res: Response,
  next: Function,
): Promise<void> => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;

    const {
      data,
      page: currentPage,
      total,
      totalPages,
    } = await getAllHistoryService(userId, page);

    return sendSuccess(res, 200, 'History fetched successfully', data, {
      page: currentPage,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getDetailHistory = async (
  req: Request,
  res: Response,
  next: Function,
): Promise<void> => {
  try {
    const historyId = req.params.id;
    const history = await getDetailHistoryService(historyId);

    return sendSuccess(
      res,
      200,
      'History detail fetched successfully',
      history,
    );
  } catch (error) {
    next(error);
  }
};

export const getAllHistoryByUser = async (
  req: Request,
  res: Response,
  next: Function,
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const page = Number(req.query.page) || 1;

    const {
      data,
      page: currentPage,
      total,
      totalPages,
    } = await getAllHistoryService(userId, page);

    return sendSuccess(res, 200, 'History fetched successfully', data, {
      page: currentPage,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};
