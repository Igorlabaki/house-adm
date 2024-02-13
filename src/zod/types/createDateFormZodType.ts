import { createDateEventFormSchema } from '../schemas/createDateFormZodSchema';

import { z } from 'zod';

export type CreateDateEventFormData = z.infer<typeof createDateEventFormSchema>;
