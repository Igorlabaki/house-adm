import { z } from 'zod';

export const createTextFormSchema = z.object({
  venueId: z.string(),
  question: z.string(),
  response: z.string(),
});

export type CreateTextFormData = z.infer<typeof createTextFormSchema>;