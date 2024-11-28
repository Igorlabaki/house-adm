
import { createPagamentoFormSchema } from '@schemas/createPagamentoFormZodSchema';
import { z } from 'zod';

export type CreatePagamentoFormData = z.infer<typeof createPagamentoFormSchema>;
