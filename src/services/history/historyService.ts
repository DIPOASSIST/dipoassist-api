import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllHistoryService = async (userId: string) => {
  try {
    const result = await prisma.history.findMany({
      where: { user_id: userId },
    });

    return result;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw new Error('Failed to fetch history');
  }
};

export const getDetailHistoryService = async (id: string) => {
  try {
    const result = await prisma.history.findUnique({
      where: { id },
    });
    return result;
  } catch (error) {
    console.error('Error fetching history detail:', error);
    throw new Error('Failed to fetch history detail');
  }
};
