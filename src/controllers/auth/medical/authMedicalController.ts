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
      res.status(409).json({ message: 'Email is already registered' });
      return; // important to stop the execution
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
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const passwordMatch = await bcrypt.compare(data.password, medical.password);

    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid password' });
      return;
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
