import { z } from "zod";

export const createOwnerFormSchema = z.object({
    cep: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    pix: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    cpf: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    city: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    state: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    street: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    bankName: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    bankAgency: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    streetNumber: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    completeName: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    neighborhood: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    rg: z.string().optional(),
    organizationId: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    bankAccountNumber: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    complement: z.string().optional(),
});

export type CreateOwnerFormSchema = z.infer<typeof createOwnerFormSchema>;

