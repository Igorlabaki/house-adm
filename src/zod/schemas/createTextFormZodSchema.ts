import { z } from 'zod';

export const createTextFormSchema = z.object({
  area: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  titulo: z.string().nullable(),
  text: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  position: z.coerce.number({
    required_error: 'This field is required',
  }),
});
