import { z } from 'zod';

export const createPaymentFormSchema = z.object({
  amount: z
    .string({
      required_error: 'Este campo e obrigatorio',
    }),
  paymentDate: z
    .string({
      required_error: 'Este campo e obrigatorio',
    }),
  imageUrl: z.string().optional()
});

export type CreatePaymentFormSchema = z.infer<typeof createPaymentFormSchema>;