import { min } from 'moment';
import { z } from 'zod';

export const createDateEventFormSchema = z
  .object({
    tipo: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    titulo: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!')
      .min(1, 'Este campo é obrigatório!'),
    dataInicio: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
    orcamentoCheck: z.boolean({
      required_error: 'Este campo é obrigatório!',
    }),
    horarioFim: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    horarioInicio: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    orcamentoId: z.union([
      z.string(),
      z.undefined(),
    ]),
  })
  .refine(
    (data) => {
      if (data.orcamentoCheck && !data.orcamentoId) {
        return false;
      }
      return true;
    },
    {
      message: 'Este campo é obrigatório!',
      path: ['orcamento'],
    },
  ); /* .refine((data) => {
  if (data.tipo && data.orcamento && data.orcamentoCheck && data.orcamento.dataInicio) {
    if (data.tipo === "Visita" && data.data > data.orcamento.dataInicio) {
      return false
    }
    return true;
  }},{
    message: "Data da visita deve ser anterior à data do evento!",
    path: ["data"]
  }
)   */
