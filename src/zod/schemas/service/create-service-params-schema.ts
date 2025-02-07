import { z } from 'zod';

export const createServiceFormSchema = z.object({
  name: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
  price: z.number({
    required_error: 'Este campo é obrigatório!',
  }),
  venueId: z.string({
    required_error: 'Este campo é obrigatório!',
  }),
});

export type CreateServiceFormData = z.infer<typeof createServiceFormSchema>;