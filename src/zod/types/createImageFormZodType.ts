import { createImageFormSchema } from '../schemas/createImageFormZodSchema';

import { z } from 'zod';

export type CreateImageFormData = z.infer<typeof createImageFormSchema>;
