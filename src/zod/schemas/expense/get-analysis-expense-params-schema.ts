import { z } from 'zod';

export const getAnalysisExpenseFormSchema = z.object({
  year: z.string(),
  venueId: z.string(),
});

export type GetAnalysisExpenseFormData = z.infer<typeof getAnalysisExpenseFormSchema>;