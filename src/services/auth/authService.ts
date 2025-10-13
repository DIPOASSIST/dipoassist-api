import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RegisterType } from '../../validator/auth/registerValidator';
import { ChangePasswordType } from '../../validator/auth/changePasswordValidator';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const registerUserService = async (data: RegisterType) => {
  try {
    const result = await prisma.user.create({
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
      throw new Error('Error creating user: ' + error.message);
    }
    throw new Error('Unknown error creating user');
  }
};

export const getUserByEmailService = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getUserByIdService = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error fetching user: ' + error.message);
    }
    throw new Error('Unknown error fetching user');
  }
};

export const getUserByUsernameService = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
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

export const changePasswordUserService = async (
  userId: string,
  data: ChangePasswordType,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isMatchPassword = await bcrypt.compare(
      data.current_password,
      user.password,
    );

    if (!isMatchPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedNewPassword = await bcrypt.hash(data.new_password, 10);

    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedNewPassword,
      },
    });

    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error changing password: ' + error.message);
    }
    throw new Error('Unknown error changing password');
  }
};
