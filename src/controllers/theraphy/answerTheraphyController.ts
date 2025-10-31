import { NextFunction, Request, Response } from 'express';
import {
  createAnswerTheraphyService,
  getAnswerTheraphyService,
} from '../../services/theraphy/answerTheraphyService';
import { sendSuccess } from '../../helper/response';

export const getAnswerTheraphy = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const questionId = req.params.questionId;

    const data = await getAnswerTheraphyService(questionId);

    return sendSuccess(res, 200, 'Answer therapy fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const createAnswerTheraphy = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { question_id, answer_text } = req.body;
    const answer_image = req.file;

    const data = await createAnswerTheraphyService({
      question_id,
      answer_text,
      answer_image,
    });

    return sendSuccess(res, 201, 'Answer therapy created successfully', data);
  } catch (error) {
    next(error);
  }
};
