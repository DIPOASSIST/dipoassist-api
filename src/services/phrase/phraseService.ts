import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PhraseType } from '../../validator/phrase/phraseValidator';

const prisma = new PrismaClient();

export const getAllPhrasesService = async () => {
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

export const getPhraseByIdService = async (id: string) => {
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

export const createPhraseService = async (data: PhraseType) => {
  try {
    const result = await prisma.phrase.create({
      data: {
        id: uuidv4(),
        text: data.text,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating phrase: ' + error.message);
    }
    throw new Error('Unknown error creating phrase');
  }
};

export const updatePhraseService = async (id: string, data: PhraseType) => {
  try {
    const result = await prisma.phrase.update({
      where: { id },
      data: {
        text: data.text,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating phrase: ' + error.message);
    }
    throw new Error('Unknown error updating phrase');
  }
};

export const deletePhraseService = async (id: string) => {
  try {
    const result = await prisma.phrase.delete({
      where: { id },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting phrase: ' + error.message);
    }
    throw new Error('Unknown error deleting phrase');
  }
};
