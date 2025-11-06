import { z } from 'zod';

export const requestResetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const confirmResetPasswordSchema = z.object({
  otp: z.string().min(1, { message: 'OTP is required' }),
  newPassword: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
});

export type ResetPasswordType = z.infer<typeof requestResetPasswordSchema>;
export type ConfirmResetPasswordType = z.infer<
  typeof confirmResetPasswordSchema
>;
