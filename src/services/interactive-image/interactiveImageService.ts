import { PrismaClient } from '@prisma/client';
import cloudinary from '../../lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateInteractiveImageProps,
  UpdateInteractiveImageProps,
} from '../../types/interactiveImage/interactiveImage';

const prisma = new PrismaClient();

export const getAllInteractiveImageService = async () => {
  try {
    const result = await prisma.interactiveImage.findMany();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching interactive images: ' + error.message);
    }
    throw new Error('Unknown error fetching interactive images');
  }
};

export const createInteractiveImageService = async (
  data: CreateInteractiveImageProps,
) => {
  try {
    const { title, image_url } = data;

    let imageUrl: string | undefined;

    if (image_url && image_url.buffer) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'interactive_images',
            public_id: uuidv4(),
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          },
        );
        stream.end(image_url.buffer);
      });
    }

    const result = await prisma.interactiveImage.create({
      data: {
        title,
        image_url: imageUrl || '',
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating interactive image: ' + error.message);
    }
    throw new Error('Unknown error creating interactive image');
  }
};

export const updateInteractiveImageService = async (
  id: string,
  data: UpdateInteractiveImageProps,
) => {
  try {
    const { title, image_url } = data;
    let imageUrl: string | undefined;

    if (image_url && image_url.buffer) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'interactive_images',
            public_id: uuidv4(),
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          },
        );
        stream.end(image_url.buffer);
      });
    }

    const result = await prisma.interactiveImage.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(imageUrl && { image_url: imageUrl }),
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating interactive image: ' + error.message);
    }
    throw new Error('Unknown error updating interactive image');
  }
};

export const deleteInteractiveImageService = async (id: string) => {
  try {
    const result = await prisma.interactiveImage.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting interactive image: ' + error.message);
    }
    throw new Error('Unknown error deleting interactive image');
  }
};
