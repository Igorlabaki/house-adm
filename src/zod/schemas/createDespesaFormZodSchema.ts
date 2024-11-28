import { z } from 'zod';

export const createDespesaFormSchema = z.object({
  descricao: z
    .string({
      required_error: 'Este campo e obrigatorio!',
    })
    .nonempty('Este campo e obrigatorio!'),
  tipo: z
    .string({
      required_error: 'Este campo e obrigatorio!',
    })
    .nonempty('Este campo e obrigatorio!'),
  categoria: z
    .string({
      required_error: 'Este campo e obrigatorio!',
    })
    .nonempty('Este campo e obrigatorio!'),
  valor: z.string({
    required_error: 'Este campo e obrigatorio!',
  }),
  dataPagamento: z.string().nonempty('Este campo e obrigatorio!').default(new Date().toISOString()),
  recorrente: z.boolean().default(false),
});
