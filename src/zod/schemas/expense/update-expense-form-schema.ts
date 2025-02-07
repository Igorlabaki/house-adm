import { z } from "zod";

export const updateExpenseFormSchema = z.object({
    expenseId: z.string(),
    data: z.object({
        name: z.string().optional(),
        type: z.string().optional(),
        value: z.string().optional(),
        amount: z.number().optional(),
        category:z.string().optional(),
        recurring: z.boolean().optional(),
        description: z.string().optional(),
        paymentDate: z.string().optional(),
    }),
});

export type UpdateExpenseFormSchema = z.infer<typeof updateExpenseFormSchema>;