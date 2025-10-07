import { z } from 'zod';

export const registerSchema = z.object({
  nakes_id: z.string().uuid().optional().nullable(),
  email: z.string().email().nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .nonempty('Password is required'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .nonempty('Username is required'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .nonempty('Name is required'),
  role: z.enum(['ADMIN', 'USER', 'NAKES']).default('USER'),
  phone_number: z
    .string()
    .min(10, 'Phone number must be at least 10 digits long'),
});

export type RegisterType = z.infer<typeof registerSchema>;
