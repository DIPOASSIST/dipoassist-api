import { PrismaClient } from '@prisma/client';
import { QuestionTheraphyType } from '../../validator/theraphy/questionTheraphyValidator';

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
  data: QuestionTheraphyType,
) => {
  try {
    const result = await prisma.questionTheraphy.create({
      data: {
        theraphy_id: data.theraphy_id,
        question_text: data.question_text,
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
