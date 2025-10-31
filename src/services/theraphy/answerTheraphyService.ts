import { PrismaClient } from '@prisma/client';
import { CreateAnswerTheraphyProps } from '../../types/theraphy/answerTheraphy';
import cloudinary from '../../lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getAnswerTheraphyService = async (questionId: string) => {
  try {
    const result = await prisma.answerTheraphy.findUnique({
      where: {
        question_id: questionId,
      },
      select: {
        id: true,
        answer_text: true,
        answer_image: true,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching answer therapy: ' + error.message);
    }
    throw new Error('Unknown error fetching answer therapy');
  }
};

export const createAnswerTheraphyService = async (
  data: CreateAnswerTheraphyProps,
) => {
  try {
    const { question_id, answer_text, answer_image } = data;

    let answerImage: string | undefined;

    if (answer_image && answer_image.buffer) {
      answerImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'answer_theraphy',
            public_id: uuidv4(),
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          },
        );
        stream.end(answer_image.buffer);
      });
    }

    const result = await prisma.answerTheraphy.create({
      data: {
        question_id,
        answer_text,
        answer_image: answerImage || '',
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating answer therapy: ' + error.message);
    }
    throw new Error('Unknown error creating answer therapy');
  }
};
