import { z } from 'zod';

export const theraphySemanticSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
});

export type TheraphySemanticType = z.infer<typeof theraphySemanticSchema>;
