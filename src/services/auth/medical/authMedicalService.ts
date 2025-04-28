import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RegisterType } from '../../../validator/auth/registerValidator';

const prisma = new PrismaClient();

export const registerMedicalService = async (data: RegisterType) => {
  try {
    const result = await prisma.medicalPersonal.create({
      data: {
        id: uuidv4(),
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
      throw new Error('Error creating medical user: ' + error.message);
    }
    throw new Error('Unknown error creating medical user');
  }
};

export const getMedicalByEmailService = async (email: string) => {
  try {
    const user = await prisma.medicalPersonal.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching medical user: ' + error.message);
    }
    throw new Error('Unknown error fetching medical user');
  }
};

export const getMedicalByIdService = async (id: string) => {
  try {
    const user = await prisma.medicalPersonal.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching medical user: ' + error.message);
    }
    throw new Error('Unknown error fetching medical user');
  }
};

export const getMedicalByUsernameService = async (username: string) => {
  try {
    const user = await prisma.medicalPersonal.findUnique({
      where: { username },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching medical user: ' + error.message);
    }
    throw new Error('Unknown error fetching medical user');
  }
};
