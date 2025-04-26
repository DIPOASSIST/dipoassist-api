import { z } from 'zod';

export const phraseSchema = z.object({
  text: z.string().nonempty('Text is required'),
});

export type PhraseType = z.infer<typeof phraseSchema>;
