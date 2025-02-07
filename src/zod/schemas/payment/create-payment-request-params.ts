import { z } from 'zod';

export const createPaymentRequestParamsSchema = z.object({
  amount: z
    .number({
      required_error: 'Este campo e obrigatorio',
    }),
  paymentDate: z
    .string({
      required_error: 'Este campo e obrigatorio',
    }),
  userId: z.string(),
  venueId: z.string(),
  username: z.string(),
  proposalId: z.string(),
});

export type CreatePaymentRequestParamsSchema = z.infer<typeof createPaymentRequestParamsSchema>;
