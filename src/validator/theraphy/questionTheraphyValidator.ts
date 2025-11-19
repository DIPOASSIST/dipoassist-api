import { z } from 'zod';

export const questionTheraphySchema = z.object({
  theraphy_id: z.string().uuid(),
  question_text: z
    .string()
    .min(5, 'Question text must be at least 5 characters long'),
  question_id: z.string().uuid(),
  answer_text: z
    .string()
    .min(5, 'Answer text must be at least 5 characters long'),
});

export type QuestionTheraphyType = z.infer<typeof questionTheraphySchema>;
