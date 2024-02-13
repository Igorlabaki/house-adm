import { z } from 'zod';

export const createValueFormSchema = z.object({
  titulo: z
    .string({
      required_error: 'Este campo e obrigatorio!',
    })
    .nonempty('Este campo e obrigatorio!'),
  valor: z.string({
    required_error: 'Este campo e obrigatorio!',
  }),
});
