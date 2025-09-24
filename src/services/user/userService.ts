import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllUserService = async () => {
  try {
    const user = await prisma.user.findMany();
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getDetailUserService = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getUserNakesService = async () => {
  try {
    const user = await prisma.user.findMany({
      where: {
        role: Role.NAKES,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getUserRoleUserService = async () => {
  try {
    const user = await prisma.user.findMany({
      where: {
        role: Role.USER,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getUserByNakesService = async (nakesId: string) => {
  try {
    const user = await prisma.user.findMany({
      where: {
        nakes_id: nakesId,
      },
    });

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};
