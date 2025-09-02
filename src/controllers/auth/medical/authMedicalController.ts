import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Medical } from '../../../types/auth/medical';
import { registerSchema } from '../../../validator/auth/registerValidator';
import {
  getMedicalByEmailService,
  registerMedicalService,
} from '../../../services/auth/medical/authMedicalService';
import { loginSchema } from '../../../validator/auth/loginValidator';
import { sendError } from '../../../helper/response';

export const withoutPasswordHandler = (medical: Medical) => {
  const { password, ...medicalWithoutPassword } = medical;
  return medicalWithoutPassword;
};

export const generateToken = (medical: Medical): string => {
  const payload = {
    id: medical.id,
    email: medical.email,
    role: medical.role,
    name: medical.name,
    username: medical.username,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
  });
};

export const registerMedical = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const existingMedical = await getMedicalByEmailService(data.email);
    if (existingMedical) {
      return sendError(res, 409, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newMedical = await registerMedicalService({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(newMedical);
    const medicalWithoutPassword = withoutPasswordHandler(newMedical);

    res.status(201).json({
      message: 'Medical user successfully registered',
      medical: medicalWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginMedical = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const medical = await getMedicalByEmailService(data.email);

    if (!medical) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(data.password, medical.password);

    if (!passwordMatch) {
      return sendError(res, 401, 'Invalid password');
    }

    const token = generateToken(medical);

    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      id: medical.id,
      token,
    });
  } catch (error) {
    next(error);
  }
};
