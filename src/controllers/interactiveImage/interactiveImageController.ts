import { NextFunction, Request, Response } from 'express';
import {
  createInteractiveImageService,
  deleteInteractiveImageService,
  getAllInteractiveImageService,
  updateInteractiveImageService,
} from '../../services/interactive-image/interactiveImageService';
import { sendSuccess } from '../../helper/response';

export const getAllInteractiveImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await getAllInteractiveImageService();

    return sendSuccess(
      res,
      200,
      'Interactive images fetched successfully',
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const createInteractiveImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title } = req.body;
    const image_url = req.file;

    if (!image_url) {
      throw new Error('Image file is required');
    }

    const data = await createInteractiveImageService({ title, image_url });

    return sendSuccess(
      res,
      201,
      'Interactive image created successfully',
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const updateInteractiveImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const interactiveImageId = req.params.id;
    const { title } = req.body;
    const image_url = req.file;

    const data = await updateInteractiveImageService(interactiveImageId, {
      title,
      image_url,
    });
    return sendSuccess(
      res,
      200,
      'Interactive image updated successfully',
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const deleteInteractiveImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const interactiveImageId = req.params.id;
    const data = await deleteInteractiveImageService(interactiveImageId);

    return sendSuccess(
      res,
      200,
      'Interactive image deleted successfully',
      data,
    );
  } catch (error) {
    next(error);
  }
};
