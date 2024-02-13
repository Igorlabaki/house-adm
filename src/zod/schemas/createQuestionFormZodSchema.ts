import { z } from 'zod';

export const createQuestionFormSchema = z.object({
  question: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
  response: z
    .string({
      required_error: 'This field is required',
    })
    .nonempty('This field is required'),
});
