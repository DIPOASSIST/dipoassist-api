import { NextFunction, Request, Response } from 'express';
import {
  createPhraseUrgencyService,
  deletePhraseUrgencyService,
  getAllPhraseUrgencyService,
  getPhraseUrgencyByIdService,
  updatePhraseUrgencyService,
} from '../../services/phrase/phraseUrgencyService';

export const getAllPhraseUrgency = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllPhraseUrgencyService();

    res.status(200).json({
      message: 'Phrases urgency fetched successfully',
      data,
    });
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
      res.status(404).json({
        message: 'Phrase urgency not found',
      });
      return;
    }

    res.status(200).json({
      message: 'Phrase urgency fetched successfully',
      data,
    });
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
    const userId = req.user.id;
    const data = await createPhraseUrgencyService(req.body);

    res
      .status(201)
      .json({ data, message: 'Phrase urgency created successfully' });
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

    res
      .status(200)
      .json({ data, message: 'Phrase urgency updated successfully' });
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

    res
      .status(200)
      .json({ data, message: 'Phrase urgency deleted successfully' });
  } catch (error) {
    next(error);
  }
};
