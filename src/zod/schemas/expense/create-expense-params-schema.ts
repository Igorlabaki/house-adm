import { z } from 'zod';

export const createExpenseFormSchema = z.object({
  venueId: z.string(),
  name: z
    .string({
      required_error: 'Estem campo e obrigatorio.',
    })
    .nonempty('Estem campo e obrigatorio.'),
  description: z.string().optional(),
  amount: z.string({
    required_error: 'Estem campo e obrigatorio.',
  }),
  paymentDate: z.string().optional(),
  type: z.string({
    required_error: 'Estem campo e obrigatorio.',
  }),
  category: z.string({
    required_error: 'Estem campo e obrigatorio.',
  }),
  recurring: z.boolean({
    required_error: 'Estem campo e obrigatorio.',
  }),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseFormSchema>;