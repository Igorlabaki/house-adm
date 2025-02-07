import { z } from 'zod';

export const createSameDayDateRequestParmsSchema = z
  .object({
    userId: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    venueId: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    username: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    proposalId: z.string({
      required_error: 'Este campo é obrigatório!',
    }).optional(),
    data: z.object({
      title: z.string(),
      endHour: z.string({
        required_error: 'Este campo é obrigatório!',
      }).length(5, "O horário deve estar no formato HH:MM").refine(
        (val) => {
          const horario = val.split(':');
          const hora = parseInt(horario[0]);
          return hora >= 7 && hora <= 22;
        },
        {
          message: 'O fim do evento deve estar entre 7:00 e 22:00',
        },
      ),
      startHour: z.string({
        required_error: 'Este campo é obrigatório!',
      }).length(5, "O horário deve estar no formato HH:MM").refine(
        (val) => {
          const horario = val.split(':');
          const hora = parseInt(horario[0]);
          return hora >= 7 && hora <= 22;
        },
        {
          message: 'O fim do evento deve estar entre 7:00 e 22:00',
        },
      ),
      date: z.string({
        required_error: 'Este campo é obrigatório!',
      }),
      type: z.enum(["PRODUCTION", "BARTER", "OTHER", "EVENT", "OVERNIGHT","VISIT"]),
    })
  })

export type CreateSameDayDateRequestParmsSchema = z.infer<typeof createSameDayDateRequestParmsSchema>;
