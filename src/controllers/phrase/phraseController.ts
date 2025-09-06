import { NextFunction, Request, Response } from 'express';
import {
  createPhraseService,
  deletePhraseService,
  getAllPhrasesService,
  getPhraseByIdService,
  updatePhraseService,
} from '../../services/phrase/phraseService';
import { sendError, sendSuccess } from '../../helper/response';

export const getAllPhrases = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const data = await getAllPhrasesService(userId);

    return sendSuccess(res, 200, 'Phrases fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getPhraseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getPhraseByIdService(req.params.id);

    if (!data) {
      return sendError(res, 404, 'Phrase not found');
    }

    return sendSuccess(res, 200, 'Phrase fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const createPhrase = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await createPhraseService(req.body);

    return sendSuccess(res, 201, 'Phrase created successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updatePhrase = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  {
    try {
      const data = await updatePhraseService(req.params.id, req.body);

      if (!data) {
        return sendError(res, 404, 'Phrase not found');
      }

      return sendSuccess(res, 200, 'Phrase updated successfully', data);
    } catch (error) {
      next(error);
    }
  }
};

export const deletePhrase = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await deletePhraseService(req.params.id);

    if (!data) {
      return sendError(res, 404, 'Phrase not found');
    }

    return sendSuccess(res, 200, 'Phrase deleted successfully', data);
  } catch (error) {
    next(error);
  }
};
