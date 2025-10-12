import { PrismaClient, Role } from '@prisma/client';
import { CreateUserType } from '../../validator/user/createUserValidator';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '../../lib/cloudinary';
import { UpdateAccountServiceProps } from '../../types/user/updateAccount';

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

export const getCountUserByNakesService = async (nakesId: string) => {
  try {
    const count = await prisma.user.count({
      where: {
        nakes_id: nakesId,
      },
    });

    return count;
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

export const updateAccountService = async (data: UpdateAccountServiceProps) => {
  try {
    const { id, name, email, username, phone_number, image } = data;

    let imageUrl: string | undefined;

    if (image && image.buffer) {
      imageUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'user_profiles',
            public_id: uuidv4(),
            resource_type: 'image',
          },
          (error, result) => {
            if (error || !result) return reject(error);
            resolve(result.secure_url);
          },
        );
        stream.end(image.buffer);
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(username !== undefined && { username }),
        ...(phone_number !== undefined && { phone_number }),
        ...(imageUrl && { image_url: imageUrl }),
      },
    });

    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error('Error updating account: ' + error.message);
    }
    throw new Error('Unknown error updating account');
  }
};
