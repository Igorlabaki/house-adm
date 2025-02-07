import { z } from 'zod';

export const updatePaymentRequestParamsSchema = z.object({
  userId: z.string(),
  venueId: z.string(),
  username: z.string(),
  proposalId: z.string(),
  paymentId: z.string(),
  data: z.object({
    amount: z
      .number({
        required_error: 'Este campo e obrigatorio',
      }),
    paymentDate: z
      .string({
        required_error: 'Este campo e obrigatorio',
      })
  })
})


export type UpdatePaymentRequestParamsSchema = z.infer<typeof updatePaymentRequestParamsSchema>;
