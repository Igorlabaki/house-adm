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
    nomeEmpresaCompleto: z
    .string({
      required_error: 'Este campo é obrigatório!',
    })
    .nonempty('Este campo é obrigatório!'),
   rg: z
      .string().optional(), 
    nomeRepresentanteCompleto: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
    rua: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      numero: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      bairro: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      cep: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      cidade: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
      estado: z
      .string({
        required_error: 'Este campo é obrigatório!',
      })
      .nonempty('Este campo é obrigatório!'),
  });