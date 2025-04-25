import { NextFunction, Request, Response } from 'express';
import { User } from '../../types/auth/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { registerSchema } from '../../validator/auth/registerValidator';
import {
  getUserByEmailService,
  registerUserService,
} from '../../services/auth/authService';

export const withoutPasswordHandler = (user: User) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    username: user.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
  });
};

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // validate request body against the schema
    const data = registerSchema.parse(req.body);

    // check if user already exists
    const existingUser = await getUserByEmailService(data.email);
    if (existingUser) {
      res.status(409).json({ message: 'Email is already registered' });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await registerUserService({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(newUser);
    const userWithoutPassword = withoutPasswordHandler(newUser);

    res.status(201).json({
      message: 'User successfully registered',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};
