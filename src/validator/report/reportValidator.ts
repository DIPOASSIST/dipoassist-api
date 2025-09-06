import { z } from 'zod';

export const reportSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
});

export type ReportType = z.infer<typeof reportSchema>;
