import { NextFunction, Request, Response } from 'express';
import { sendError, sendSuccess } from '../../helper/response';
import {
  createTheraphySemanticService,
  deleteTheraphySemanticByIdService,
  getAllTherapiesSemanticService,
  getTheraphySemanticByIdService,
  updateTheraphySemanticByIdService,
} from '../../services/theraphy/theraphySemanticService';

export const getAllTheraphySemantic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await getAllTherapiesSemanticService();

    return sendSuccess(
      res,
      200,
      'Therapies semantic fetched successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const getTheraphySemanticById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;
    const result = await getTheraphySemanticByIdService(id);

    if (!result) {
      return sendError(res, 404, 'Therapy semantic not found');
    }

    return sendSuccess(
      res,
      200,
      'Therapy semantic fetched successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const createTheraphySemantic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body;

    const result = await createTheraphySemanticService(data);

    return sendSuccess(
      res,
      201,
      'Therapy semantic created successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const updateTheraphySemanticById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = req.body;
    const id = req.params.id;

    const theraphy = await getTheraphySemanticByIdService(id);

    if (!theraphy) {
      return sendError(res, 404, 'Therapy semantic not found');
    }

    const result = await updateTheraphySemanticByIdService(id, data);
    return sendSuccess(
      res,
      200,
      'Therapy semantic updated successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteTheraphySemanticById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;

    const result = await deleteTheraphySemanticByIdService(id);

    return sendSuccess(
      res,
      200,
      'Therapy semantic deleted successfully',
      result,
    );
  } catch (error) {
    next(error);
  }
};
