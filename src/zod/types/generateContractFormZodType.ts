import { generateContractFormSchema } from '@schemas/generateContractFormZodSchema';

import { z } from 'zod';

export type GenerateContractFormData = z.infer<typeof generateContractFormSchema>;
