import { loginFormSchema } from '@schemas/loginFormZodSchema';
import { z } from 'zod';

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
