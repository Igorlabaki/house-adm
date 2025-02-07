import { z } from "zod";

export const createScheduleFormSchema = z.object({
    name: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    endHour: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    startHour: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    proposalId: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    workerNumber: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    description: z.string().optional(),
});

export type CreateScheduleFormSchema = z.infer<typeof createScheduleFormSchema>;