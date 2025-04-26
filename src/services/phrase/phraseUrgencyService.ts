import { PrismaClient } from '@prisma/client';
import { PhraseUrgencyType } from '../../validator/phrase/phraseUrgencyValidator';

const prisma = new PrismaClient();

export const getAllPhraseUrgencyService = async () => {
  try {
    const result = await prisma.phrase.findMany();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching phrases: ' + error.message);
    }
    throw new Error('Unknown error fetching phrases');
  }
};

export const getPhraseUrgencyByIdService = async (id: string) => {
  try {
    const result = await prisma.phrase.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching phrase: ' + error.message);
    }
    throw new Error('Unknown error fetching phrase');
  }
};

export const createPhraseUrgencyService = async (data: PhraseUrgencyType) => {
  try {
    const result = await prisma.phraseUrgency.create({
      data: {
        user_id: data.user_id,
        phrase_id: data.phrase_id,
        is_urgent: data.is_urgent,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating phrase urgency: ' + error.message);
    }
    throw new Error('Unknown error creating phrase urgency');
  }
};

export const updatePhraseUrgencyService = async (
  id: string,
  data: PhraseUrgencyType,
) => {
  try {
    const result = await prisma.phraseUrgency.update({
      where: { id },
      data: {
        is_urgent: data.is_urgent,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating phrase urgency: ' + error.message);
    }
    throw new Error('Unknown error updating phrase urgency');
  }
};

export const deletePhraseUrgencyService = async (id: string) => {
  try {
    const result = await prisma.phraseUrgency.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting phrase urgency: ' + error.message);
    }
    throw new Error('Unknown error deleting phrase urgency');
  }
};
