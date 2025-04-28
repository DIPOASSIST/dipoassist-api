import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RegisterType } from '../../../validator/auth/registerValidator';

const prisma = new PrismaClient();

export const registerAdminService = async (data: RegisterType) => {
  try {
    const result = await prisma.admin.create({
      data: {
        id: uuidv4(),
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
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

export const getAdminByEmailService = async (email: string) => {
  try {
    const user = await prisma.admin.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching admin: ' + error.message);
    }
    throw new Error('Unknown error fetching admin');
  }
};

export const getAdminByIdService = async (id: string) => {
  try {
    const user = await prisma.admin.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching admin: ' + error.message);
    }
    throw new Error('Unknown error fetching admin');
  }
};

export const getAdminByUsernameService = async (username: string) => {
  try {
    const user = await prisma.admin.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};
