import { z } from 'zod';

export const interactiveImageSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
});

export type InteractiveImageType = z.infer<typeof interactiveImageSchema>;
