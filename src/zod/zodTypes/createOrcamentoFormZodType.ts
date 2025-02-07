
import { z } from 'zod';
import { createOrcamentoFormSchema } from '../schemas/createOrcamentoFormZodSchema';

export type CreateOrcamentoFormData = z.infer<typeof createOrcamentoFormSchema>;
