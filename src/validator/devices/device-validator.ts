import { z } from 'zod';

export const deviceSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  medical_id: z.string().min(5, 'Device ID must be at least 5 characters long'),
  name: z.string().min(3, 'Name must be at least 3 characters long'),
});

export type DeviceType = z.infer<typeof deviceSchema>;
