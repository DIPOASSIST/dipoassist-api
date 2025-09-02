import { NextFunction, Request, Response } from 'express';
import { User } from '../../types/auth/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { registerSchema } from '../../validator/auth/registerValidator';
import {
  getUserByEmailService,
  registerUserService,
} from '../../services/auth/authService';
import { loginSchema } from '../../validator/auth/loginValidator';
import { sendError, sendSuccess } from '../../helper/response';

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
      return sendError(res, 409, 'Email is already registered');
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await registerUserService({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(newUser);
    const userWithoutPassword = withoutPasswordHandler(newUser);

    return sendSuccess(res, 201, 'User successfully registered', {
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  {
    try {
      const data = loginSchema.parse(req.body);

      const user = await getUserByEmailService(data.email);

      if (user && bcrypt.compareSync(data.password, user.password)) {
        const token = generateToken(user);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({
          id: user.id,
          token,
        });
      }

      if (!user) {
        return sendError(res, 404, 'User not found');
      }

      if (!bcrypt.compareSync(data.password, user.password)) {
        return sendError(res, 401, 'Invalid password');
      }
    } catch (error) {
      next(error);
    }
  }
};
