import moment from 'moment';
import { z } from 'zod';

export const createOvernigthDateEventFormSchema = z
  .object({
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
    endDay: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    startDay: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    type: z.enum(["PRODUCTION", "BARTER", "OTHER", "EVENT", "OVERNIGHT","VISIT"]),
  }).refine((data) => {
    const start = moment(data.startDay, "DD/MM/YYYY", true);
    const end = moment(data.endDay, "DD/MM/YYYY", true);
  
    return start.isValid() && end.isValid() && start.isSameOrBefore(end);
  }, {
    message: "A data de início não pode ser depois da data de término!",
    path: ["startDay"],
  });

export type CreateOvernigthDateEventFormSchema = z.infer<typeof createOvernigthDateEventFormSchema>;
