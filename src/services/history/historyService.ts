import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllHistoryService = async (
  userId: string,
  page = 1,
  label?: string,
) => {
  try {
    const limit = 10;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.HistoryWhereInput = {
      user_id: userId,
      ...(label ? { predicted_label: { contains: label.toLowerCase() } } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.history.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      prisma.history.count({
        where: whereClause,
      }),
    ]);

    return {
      data,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
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

export const getAllHistoryNoPaginationService = async ({
  label,
  createdAt,
}: GetAllHistoryFilter) => {
  try {
    const whereClause: Prisma.HistoryWhereInput = {
      ...(label ? { predicted_label: { contains: label.toLowerCase() } } : {}),
    };

    if (createdAt) {
      if (createdAt.exact) {
        const date = new Date(createdAt.exact);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        whereClause.created_at = {
          gte: date,
          lt: nextDate,
        };
      } else {
        whereClause.created_at = {};
        if (createdAt.from) {
          whereClause.created_at.gte = new Date(createdAt.from);
        }
        if (createdAt.to) {
          whereClause.created_at.lte = new Date(createdAt.to);
        }
      }
    }

    const data = await prisma.history.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
    });

    return { data, total: data.length };
  } catch (error) {
    console.error('Error fetching history:', error);
    throw new Error('Failed to fetch history');
  }
};
