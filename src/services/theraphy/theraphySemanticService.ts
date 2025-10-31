import { PrismaClient } from '@prisma/client';
import { TheraphySemanticType } from '../../validator/theraphy/theraphySemanticValidator';

const prisma = new PrismaClient();

export const getAllTherapiesSemanticService = async () => {
  try {
    const result = await prisma.theraphySemantic.findMany();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching therapies semantic: ' + error.message);
    }
    throw new Error('Unknown error fetching therapies semantic');
  }
};

export const getTheraphySemanticByIdService = async (id: string) => {
  try {
    const result = await prisma.theraphySemantic.findUnique({
      where: {
        id: id,
      },
    });

    if (!result) {
      throw new Error('Therapy semantic not found');
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        'Error fetching therapy semantic by id: ' + error.message,
      );
    }
    throw new Error('Unknown error fetching therapy semantic by id');
  }
};

export const createTheraphySemanticService = async (
  data: TheraphySemanticType,
) => {
  try {
    const result = await prisma.theraphySemantic.create({
      data: {
        title: data.title,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating therapy semantic: ' + error.message);
    }
    throw new Error('Unknown error creating therapy semantic');
  }
};

export const updateTheraphySemanticByIdService = async (
  id: string,
  data: TheraphySemanticType,
) => {
  try {
    const therapy = await prisma.theraphySemantic.findUnique({
      where: {
        id: id,
      },
    });

    if (!therapy) {
      throw new Error('Therapy semantic not found');
    }

    const result = await prisma.theraphySemantic.update({
      where: {
        id: id,
      },
      data: {
        title: data.title,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        'Error updating therapy semantic by id: ' + error.message,
      );
    }
    throw new Error('Unknown error updating therapy semantic by id');
  }
};

export const deleteTheraphySemanticByIdService = async (id: string) => {
  try {
    const result = await prisma.theraphySemantic.delete({
      where: {
        id: id,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        'Error deleting therapy semantic by id: ' + error.message,
      );
    }
    throw new Error('Unknown error deleting therapy semantic by id');
  }
};
