import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .optional(),
  email: z.string().email('Invalid email address').optional(),
  phone_number: z
    .string()
    .min(10, 'Phone number is too short')
    .max(15, 'Phone number is too long')
    .optional(),
  username: z
    .string()
    .min(3, 'Username is too short')
    .max(30, 'Username is too long')
    .optional(),
});

export type UpdateUserType = z.infer<typeof updateUserSchema>;
