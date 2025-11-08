import { NextFunction, Request, Response } from 'express';
import {
  createReportService,
  deleteReportService,
  getAllReportsByUserService,
  getAllReportsService,
  getDetailReportService,
  getReportByNakesService,
  updateReportService,
} from '../../services/report/reportService';
import { sendSuccess } from '../../helper/response';

export const getAllReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllReportsService();

    return sendSuccess(res, 200, 'Reports fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAllReportByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.id;
    const data = await getAllReportsByUserService(userId);

    return sendSuccess(res, 200, 'User reports fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getReportByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.params.userId;
    const data = await getAllReportsByUserService(userId);

    return sendSuccess(res, 200, 'User reports fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getDetailReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reportId = req.params.id;
    const data = await getDetailReportService(reportId);

    return sendSuccess(res, 200, 'Report details fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const createReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    const data = await createReportService({
      user_id: userId,
      title,
      content,
    });
    return sendSuccess(res, 201, 'Report created successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updateReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reportId = req.params.id;
    const data = await updateReportService(reportId, req.body);
    return sendSuccess(res, 200, 'Report updated successfully', data);
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reportId = req.params.id;
    await deleteReportService(reportId);
    return sendSuccess(res, 200, 'Report deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getReportByNakes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const nakesId = req.user.id;
    const data = await getReportByNakesService(nakesId);

    return sendSuccess(res, 200, 'Reports fetched successfully', data);
  } catch (error) {
    next(error);
  }
};
