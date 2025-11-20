import { NextFunction, Request, Response } from 'express';
import { getTheraphySemanticByIdService } from '../../services/theraphy/theraphySemanticService';
import { sendError, sendSuccess } from '../../helper/response';
import {
  createQuestionTheraphyService,
  deleteQuestionTheraphyService,
  getQuestionTheraphyService,
  getQuestionTherapyByIdService,
  updateQuestionTheraphyService,
} from '../../services/theraphy/questionTheraphyService';

export const getQuestionTheraphy = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;

    const data = await getTheraphySemanticByIdService(id);

    if (!data) {
      return sendError(res, 404, 'Therapy semantic not found');
    }

    const question = await getQuestionTheraphyService(id);

    return sendSuccess(
      res,
      200,
      'Questions for therapy fetched successfully',
      question,
    );
  } catch (error) {
    next(error);
  }
};

export const getDetailQuestionTheraphy = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;

    const data = await getQuestionTherapyByIdService(id);

    if (!data) {
      return sendError(res, 404, 'Therapy semantic not found');
    }

    return sendSuccess(
      res,
      200,
      'Questions detail for therapy fetched successfully',
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const createQuestionTheraphy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = req.body;
    const answer_image = req.file;

    const result = await createQuestionTheraphyService({
      ...data,
      answer_image,
    });

    return sendSuccess(res, 201, 'Question created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const updateQuestionTheraphy = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;
    const data = req.body;

    const theraphy = await getTheraphySemanticByIdService(id);

    if (!theraphy) {
      return sendError(res, 404, 'Therapy semantic not found');
    }

    const question = await updateQuestionTheraphyService(id, data);

    return sendSuccess(
      res,
      200,
      'Question for therapy updated successfully',
      question,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteQuestionTheraphy = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = req.params.id;

    const theraphy = await getQuestionTherapyByIdService(id);

    if (!theraphy) {
      return sendError(res, 404, 'Therapy semantic not found');
    }

    await deleteQuestionTheraphyService(id);

    return sendSuccess(res, 200, 'Question for therapy deleted successfully');
  } catch (error) {
    next(error);
  }
};
