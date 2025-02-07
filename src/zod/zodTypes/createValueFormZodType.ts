import { createValueFormSchema } from '../schemas/createValueFormZodSchema';

import { z } from 'zod';

export type CreateValueFormData = z.infer<typeof createValueFormSchema>;
