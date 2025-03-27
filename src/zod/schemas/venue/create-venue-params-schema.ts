import { z } from 'zod';

export const createVenueFormSchema = z
  .object({
    clientCompleteName: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    street: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    email: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    streetNumber: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
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
    pricingModel: z.enum(["PER_PERSON", "PER_DAY", "PER_PERSON_DAY", "PER_PERSON_HOUR"]),
    hasOvernightStay: z.boolean({
      required_error: "Este campo é obrigatório!",
    }),
    pricePerDay: z.string().optional(),
    pricePerPerson: z.string().optional(),
    pricePerPersonDay: z.string().optional(),
    pricePerPersonHour: z.string().optional(),
    owners: z.array(z.string()).min(1, "Deve haver um proprietário cadastrado."),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
  })
  .refine((data) => {
    if (data.hasOvernightStay) {
      return data.checkIn?.trim() && data.checkOut?.trim();
    }
    return true;
  }, {
    message: "Se o espaço aceitar pernoite, os campos check-in e check-out são obrigatórios.",
    path: ["checkIn"],
  })
  .refine((data) => {
    if (data.pricingModel === "PER_PERSON") {
      return data.pricePerPerson.trim();
    }
    return true;
  }, {
    message: "Se o modelo de cobrança for por pessoa, o campo 'Preço por Pessoa' é obrigatório.",
    path: ["pricePerPerson"],
  })
  .refine((data) => {
    if (data.pricingModel === "PER_DAY") {
      return data.pricePerDay.trim();
    }
    return true;
  }, {
    message: "Se o modelo de cobrança for por dia, o campo 'Preço por Dia' é obrigatório.",
    path: ["pricePerDay"],
  })
  .refine((data) => {
    if (data.pricingModel === "PER_PERSON_DAY") {
      return data.pricePerPersonDay.trim();
    }
    return true;
  }, {
    message: "Se o modelo de cobrança for por pessoa/dia, o campo 'Preço por Pessoa/Dia' é obrigatório.",
    path: ["pricePerPersonDay"],
  })
  .refine((data) => {
    if (data.pricingModel === "PER_PERSON_HOUR") {
      return data.pricePerPersonHour.trim();
    }
    return true;
  }, {
    message: "Se o modelo de cobrança for por pessoa/hora, o campo 'Preço por Pessoa/Hora' é obrigatório.",
    path: ["pricePerPersonHour"],
  });


export type CreateVenueFormSchema = z.infer<typeof createVenueFormSchema>;
