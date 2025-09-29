import { z } from 'zod';

export const scheduleSchema = z.object({
  patient_id: z.string().uuid(),
  medical_id: z.string().uuid(),
  schedule_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date format',
  }),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
});

export type ScheduleType = z.infer<typeof scheduleSchema>;
