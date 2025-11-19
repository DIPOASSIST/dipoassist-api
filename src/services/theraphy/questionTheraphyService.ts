import { PrismaClient } from '@prisma/client';
import { QuestionTheraphyType } from '../../validator/theraphy/questionTheraphyValidator';
import cloudinary from '../../lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';
import { CreateQuestionTheraphyProps } from '../../types/theraphy/answerTheraphy';

const prisma = new PrismaClient();

export const getQuestionTheraphyService = async (theraphyId: string) => {
  try {
    const result = await prisma.questionTheraphy.findMany({
      where: {
        theraphy_id: theraphyId,
      },
      select: {
        id: true,
        question_text: true,
        answers: {
          select: {
            id: true,
            answer_text: true,
            answer_image: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching question therapy: ' + error.message);
    }
    throw new Error('Unknown error fetching question therapy');
  }
};

export const createQuestionTheraphyService = async (
  data: CreateQuestionTheraphyProps,
) => {
  try {
    const { answer_image, theraphy_id, question_text, answer_text } = data;

    const result = await prisma.questionTheraphy.create({
      data: {
        theraphy_id: theraphy_id,
        question_text: question_text,
      },
    });

    let imageUrl: string | undefined;

    if (answer_image && answer_image.buffer) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'answer_images',
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

    await prisma.answerTheraphy.create({
      data: {
        question_id: result.id,
        answer_text: answer_text,
        answer_image: imageUrl,
      },
    });

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? `Error creating question therapy: ${error.message}`
        : 'Unknown error creating question therapy',
    );
  }
};

export const updateQuestionTheraphyService = async (
  id: string,
  data: QuestionTheraphyType,
) => {
  try {
    const result = await prisma.questionTheraphy.update({
      where: { id },
      data: {
        theraphy_id: data.theraphy_id,
        question_text: data.question_text,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating question therapy: ' + error.message);
    }
    throw new Error('Unknown error updating question therapy');
  }
};

export const deleteQuestionTheraphyService = async (id: string) => {
  try {
    const result = await prisma.questionTheraphy.delete({
      where: { id },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting question therapy: ' + error.message);
    }
    throw new Error('Unknown error deleting question therapy');
  }
};
