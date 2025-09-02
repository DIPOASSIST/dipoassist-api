import { NextFunction, Request, Response } from 'express';
import {
  createPhraseUrgencyService,
  deletePhraseUrgencyService,
  getAllPhraseUrgencyService,
  getPhraseUrgencyByIdService,
  updatePhraseUrgencyService,
} from '../../services/phrase/phraseUrgencyService';
import { sendError, sendSuccess } from '../../helper/response';

export const getAllPhraseUrgency = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllPhraseUrgencyService();

    return sendSuccess(res, 200, 'Phrases urgency fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getPhraseUrgencyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getPhraseUrgencyByIdService(req.params.id);

    if (!data) {
      return sendError(res, 404, 'Phrase urgency not found');
    }

    return sendSuccess(res, 200, 'Phrase urgency fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const createPhraseUrgency = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await createPhraseUrgencyService(req.body);

    return sendSuccess(res, 201, 'Phrase urgency created successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updatePhraseUrgency = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await updatePhraseUrgencyService(req.params.id, req.body);

    return sendSuccess(res, 200, 'Phrase urgency updated successfully', data);
  } catch (error) {
    next(error);
  }
};

export const deletePhraseUrgency = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await deletePhraseUrgencyService(req.params.id);

    return sendSuccess(res, 200, 'Phrase urgency deleted successfully', data);
  } catch (error) {
    next(error);
  }
};
