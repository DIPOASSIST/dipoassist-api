import { z } from 'zod';

export const answerQuestionTheraphySchema = z.object({
  question_id: z.string().uuid(),
  answer_text: z
    .string()
    .min(3, 'Answer text must be at least 3 characters long'),
});

export type AnswerQuestionTheraphyType = z.infer<
  typeof answerQuestionTheraphySchema
>;
