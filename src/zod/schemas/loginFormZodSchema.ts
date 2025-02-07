import { min } from 'moment';
import { z } from 'zod';

export const loginFormSchema = z
  .object({
    email: z
    .string({
      required_error: "Este campo é obrigatório!",
    }).email('Email invalido')
    .nonempty("Este campo é obrigatório!"),
    password: z
    .string({
      required_error: "Este campo é obrigatório!",
    })
    .nonempty("Este campo é obrigatório!"),
  })
  