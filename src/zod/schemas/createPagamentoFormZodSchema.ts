import { z } from 'zod';

export const createPagamentoFormSchema = z.object({
  value: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  dataPagamento: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
});
