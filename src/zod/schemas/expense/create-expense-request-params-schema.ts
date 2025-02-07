import { z } from 'zod';

export const createExpenseRequestSchema = z.object({
  venueId: z.string(),
  name: z
    .string({
      required_error: 'Estem campo e obrigatorio.',
    })
    .nonempty('Estem campo e obrigatorio.'),
  description: z.string().optional(),
  amount: z.number({
    required_error: 'Estem campo e obrigatorio.',
  }),
  paymentDate: z.date({
    required_error: 'Estem campo e obrigatorio.',
  }),
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

export type CreateExpenseRequestData = z.infer<typeof createExpenseRequestSchema>;