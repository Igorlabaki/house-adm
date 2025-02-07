
import { generateContractJuridicaFormSchema } from '@schemas/generateContractJuridicaFormZodSchema';

import { z } from 'zod';

export type GenerateContractJuridicaFormData = z.infer<typeof generateContractJuridicaFormSchema>;
