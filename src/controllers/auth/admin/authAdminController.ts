import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Admin } from '../../../types/auth/admin';
import { registerSchema } from '../../../validator/auth/registerValidator';
import {
  getAdminByEmailService,
  registerAdminService,
} from '../../../services/auth/admin/authAdminService';
import { loginSchema } from '../../../validator/auth/loginValidator';

export const withoutPasswordHandler = (admin: Admin) => {
  const { password, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
};

export const generateToken = (admin: Admin): string => {
  const payload = {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
    adminname: admin.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
  });
};

export const registerAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // validate request body against the schema
    const data = registerSchema.parse(req.body);

    // check if admin already exists
    const existingAdmin = await getAdminByEmailService(data.email);
    if (existingAdmin) {
      res.status(409).json({ message: 'Email is already registered' });
      return; // important to stop the execution
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newAdmin = await registerAdminService({
      ...data,
      password: hashedPassword,
    });

    const token = generateToken(newAdmin);
    const adminWithoutPassword = withoutPasswordHandler(newAdmin);

    res.status(201).json({
      message: 'admin successfully registered',
      admin: adminWithoutPassword,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  {
    try {
      const data = loginSchema.parse(req.body);

      const admin = await getAdminByEmailService(data.email);

      if (admin && bcrypt.compareSync(data.password, admin.password)) {
        const token = generateToken(admin);
        res.setHeader('Authorization', `Bearer ${token}`);
        res.status(200).json({
          id: admin.id,
          token,
        });
      }

      if (!admin) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      if (!bcrypt.compareSync(data.password, admin.password)) {
        res.status(401).json({ message: 'Invalid password' });
      }
    } catch (error) {
      next(error);
    }
  }
};
