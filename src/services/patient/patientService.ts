import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deletePatientMedicalService = async (userId: string) => {
  try {
    const patient = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        nakes_id: null,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error deleting patient medical: ' + error.message);
    }
    throw new Error('Unknown error deleting patient medical');
  }
};
