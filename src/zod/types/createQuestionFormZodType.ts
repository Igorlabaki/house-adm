import { createQuestionFormSchema } from '../schemas/createQuestionFormZodSchema';

import { z } from 'zod';

export type CreateQuestionFormData = z.infer<typeof createQuestionFormSchema>;
