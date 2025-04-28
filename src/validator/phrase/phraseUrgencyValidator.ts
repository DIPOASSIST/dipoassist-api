import { z } from 'zod';

export const phraseUrgencySchema = z.object({
  user_id: z.string().uuid(),
  phrase_id: z.string().uuid(),
  is_urgent: z.boolean(),
});

export type PhraseUrgencyType = z.infer<typeof phraseUrgencySchema>;
