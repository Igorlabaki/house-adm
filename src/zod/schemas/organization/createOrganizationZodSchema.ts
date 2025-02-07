import { z } from 'zod';

export const createOrganizationFormSchema = z
  .object({
    name: z.string({
      required_error: 'Este campo é obrigatório!',
    }
  ),
})

export type CreateOrganizationFormSchema = z.infer<typeof createOrganizationFormSchema>;

