import { z } from 'zod';

export const createImageFormSchema = z.object({
  imageUrl: z.unknown({
    required_error: 'Este campo e obrigatorio!',
  }).optional(),
  description: z
    .string({
      required_error: 'Este campo e obrigatorio!',
    })
    .nonempty('Este campo e obrigatorio!'),
  tag: z
    .string({
      required_error: 'Este campo e obrigatorio!',
    })
    .nonempty('Este campo e obrigatorio!'),
  position: z.coerce.number({
    required_error: 'Este campo e obrigatorio!',
  }),
});
