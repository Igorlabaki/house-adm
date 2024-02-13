import { z } from 'zod';

export const createOrcamentoFormSchema = z.object({
  trafegoCanal: z.string({
    required_error: 'Este campo e obrigatorio!',
  }),
  conheceEspaco: z.boolean({
    required_error: 'Este campo e obrigatorio!',
  }),
  horarioFim: z
    .string()
    .nonempty('Este campo é obrigatório!')
    .refine(
      (val) => {
        const horario = val.split(':');
        const hora = parseInt(horario[0]);
        return hora >= 7 && hora <= 22;
      },
      {
        message: 'O fim do evento deve estar entre 7:00 e 22:00',
      },
    ),
  dataInicio: z.string().nonempty('Este campo e obrigatorio!'),
  horarioInicio: z
    .string()
    .nonempty('Este campo é obrigatório!')
    .refine(
      (val) => {
        const horario = val.split(':');
        const hora = parseInt(horario[0]);
        return hora >= 7 && hora <= 22;
      },
      {
        message: 'O inicio do evento deve estar entre 7:00 e 22:00',
      },
    ),
  seguranca: z.boolean().default(false),
  limpeza: z.boolean().default(false),
  recepcionista: z.boolean().default(false),
  nome: z
    .string()
    .nonempty('Este campo e obrigatorio!')
    .min(5, 'Nome deve conter pelo menos 5 caracteres.'),
  email: z.string().email('Email invalido!').nonempty('Este campo e obrigatorio!'),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Digite um número de whatsapp válido') // Regex para validar um número de celular
    .min(15, 'Digite um número de telefone válido')
    .max(15, 'Digite um número de telefone válido'),
  texto: z
    .string()
    .nonempty('Este campo e obrigatorio!')
    .min(10, 'A descricao do evento deve conter pelo menos 10 caracteres.'),
  convidados: z
    .string()
    .nonempty('Este campo e obrigatorio!')
    .transform((val) => parseInt(val))
    .refine((val) => val <= 100, {
      message: 'O número de convidados não pode ser maior que 100',
    })
    .refine((val) => val > 0, {
      message: 'O número de convidados não pode 0',
    }),
});