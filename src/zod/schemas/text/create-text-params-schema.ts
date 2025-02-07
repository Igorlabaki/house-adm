import { z } from 'zod';

export const createTextFormSchema = z.object({
  venueId: z.string(),
  area: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  title: z.string().nullable(),
  text: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  position: z.coerce.number({
    required_error: 'This field is required',
  }),
});

export type CreateTextFormData = z.infer<typeof createTextFormSchema>;