import { z } from 'zod';

export const formServiceSchema = z.object({
  name: z.string(),
  price: z.string(),
  venueId: z.string(),
});

export type FormServiceSchema = z.infer<typeof formServiceSchema>;