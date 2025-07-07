import { z } from 'zod';

export const createOrganizationFormSchema = z
  .object({
    name: z.string({
      required_error: 'Este campo é obrigatório!',
    }).min(1, 'Nome é obrigatório'),
    email: z.string({
      required_error: 'Este campo é obrigatório!',
    }).email('Email inválido'),
    whatsappNumber: z.string().optional(),
    tiktokUrl: z.string().url('URL inválida').optional().or(z.literal('')),
    instagramUrl: z.string().url('URL inválida').optional().or(z.literal('')),
    url: z.string().url('URL inválida').optional().or(z.literal('')),
    facebookUrl: z.string().url('URL inválida').optional().or(z.literal('')),
    logoUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  })

export type CreateOrganizationFormSchema = z.infer<typeof createOrganizationFormSchema>;

