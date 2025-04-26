import { NextFunction, Request, Response } from 'express';
import {
  createPhraseService,
  deletePhraseService,
  getAllPhrasesService,
  getPhraseByIdService,
  updatePhraseService,
} from '../../services/phrase/phraseService';

export const getAllPhrases = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllPhrasesService();

    res.status(200).json({
      message: 'Phrases fetched successfully',
      data,
    });
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
      res.status(404).json({
        message: 'Phrase not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Phrase fetched successfully',
      data,
    });
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

    res.status(201).json({ message: 'Phrase created successfully', data });
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
        res.status(404).json({
          message: 'Phrase not found',
        });
        return;
      }

      res.status(200).json({ message: 'Phrase updated successfully', data });
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
      res.status(404).json({
        message: 'Phrase not found',
      });
      return;
    }

    res.status(200).json({ message: 'Phrase deleted successfully', data });
  } catch (error) {
    next(error);
  }
};
