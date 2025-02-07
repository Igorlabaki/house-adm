import { z } from 'zod';

export const createVenueFormSchema = z
  .object({
    name: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    street: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    streetNumber: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    maxGuest: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    city: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    state: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    cep: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    pricingModel: z.enum(["PER_PERSON","PER_DAY"]),
    hasOvernightStay: z.boolean({
      required_error: 'Este campo é obrigatório!',
    }),
    pricePerDay: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    pricePerPerson: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    owners: z.array(z.string()).min(1, "Deve haver um proprietario cadastrado."),
}).refine(
  (data) => {
    if (data.hasOvernightStay) {
      return data.checkIn?.trim() && data.checkOut?.trim();
    }
    return true; 
  },
  {
    message: "Se o espaço aceitar pernoite, os campos check-in e check-out são obrigatórios.",
    path: ["checkIn"], // Aponta o erro para o campo `checkIn`
  }
);


export type CreateVenueFormSchema = z.infer<typeof createVenueFormSchema>;
