import { Request, Response } from 'express';
import {
  getAllHistoryNoPaginationService,
  getAllHistoryService,
  getAllHistoryWithFilterService,
  getDetailHistoryService,
  getSummaryHistoryService,
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
    const label = req.query.label as string | undefined;

    const {
      data,
      page: currentPage,
      total,
      totalPages,
    } = await getAllHistoryService(userId, page, label);

    return sendSuccess(res, 200, 'History fetched successfully', data, {
      page: currentPage,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHistoryNoPagination = async (
  req: Request,
  res: Response,
  next: Function,
): Promise<void> => {
  try {
    const label = req.query.label as string | undefined;

    const createdAt: { exact?: string; from?: string; to?: string } = {};
    if (req.query.exact) createdAt.exact = req.query.exact as string;
    if (req.query.from) createdAt.from = req.query.from as string;
    if (req.query.to) createdAt.to = req.query.to as string;

    const { data } = await getAllHistoryNoPaginationService({
      label,
      createdAt: Object.keys(createdAt).length ? createdAt : undefined,
    });

    return sendSuccess(res, 200, 'History fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getSummaryHistory = async (
  req: Request,
  res: Response,
  next: Function,
): Promise<void> => {
  try {
    const result = await getSummaryHistoryService();

    return sendSuccess(
      res,
      200,
      'History summary fetched successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const getAllHistoryFilter = async (
  req: Request,
  res: Response,
  next: Function,
): Promise<void> => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const label = req.query.label as string | undefined;

    const createdAt: { exact?: string; from?: string; to?: string } = {};
    if (req.query.exact) createdAt.exact = req.query.exact as string;
    if (req.query.from) createdAt.from = req.query.from as string;
    if (req.query.to) createdAt.to = req.query.to as string;

    const { data, total, totalPages } = await getAllHistoryWithFilterService({
      page,
      label,
      createdAt: Object.keys(createdAt).length ? createdAt : undefined,
    });

    return sendSuccess(res, 200, 'History fetched successfully', data, {
      page,
      total,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};
