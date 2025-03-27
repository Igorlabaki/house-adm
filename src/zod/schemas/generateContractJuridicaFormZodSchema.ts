import { min } from 'moment';
import { z } from 'zod';

export const generateContractJuridicaFormSchema = z
  .object({
    cpf: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    cnpj: z.string({
      required_error: 'Este campo é obrigatório!',
    }),
    completeCompanyName: z
    .string({
      required_error: 'Este campo é obrigatório!',
    })
    .nonempty('Este campo é obrigatório!'),
   rg: z
      .string().optional(), 
      completeClientName: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
    street: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      streetNumber: z
      .string({
        required_error: 'Este campo é obrigatório!',
      }),

    neighborhood: z
        .string({
            required_error: "Este campo é obrigatório!",
        })
        .nonempty("Este campo é obrigatório!"),
      cep: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      city: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      state: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      contract: z.object({
        title: z.string(),
        clauses: z.array(z.object({
            text: z.string(),
            title: z.string(),
            position: z.number(),
            id: z.string().optional(),
        })),
    }
    ),
    paymentInfo: z.object({
        dueDate: z.string(),
        signalAmount: z.string(),
        numberPayments: z.string()
    }),
    owner: z.object({
        cep: z.string().optional(),
        pix: z.string().optional(),
        cpf: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        street: z.string().optional(),
        bankName: z.string().optional(),
        bankAgency: z.string().optional(),
        streetNumber: z.string().optional(),
        completeName: z.string().optional(),
        neighborhood: z.string().optional(),
        rg: z.string().optional(),
        organizationId: z.string().optional(),
        bankAccountNumber: z.string().optional(),
        complement: z.string().optional(),
    })
  });


  export type GenerateContractJuridicaFormSchema = z.infer<typeof generateContractJuridicaFormSchema>;