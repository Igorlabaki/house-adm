
import { createDespesaFormSchema } from '@schemas/createDespesaFormZodSchema';
import { z } from 'zod';

export type CreateDespesaFormData = z.infer<typeof createDespesaFormSchema>;
