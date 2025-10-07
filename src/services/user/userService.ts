import { PrismaClient, Role } from '@prisma/client';
import { CreateUserType } from '../../validator/user/createUserValidator';
import { v4 as uuidv4 } from 'uuid';

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

export const createUserService = async (data: CreateUserType) => {
  try {
    const result = await prisma.user.create({
      data: {
        id: uuidv4(),
        nakes_id: data.nakes_id || null,
        role: data.role,
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
      },
    });
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error creating user: ' + error.message);
    }
    throw new Error('Unknown error creating user');
  }
};
