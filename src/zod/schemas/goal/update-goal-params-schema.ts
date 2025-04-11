import { z } from "zod";

export const updateGoalSchema = z.object({
    venueId: z.string(),
    goalId: z.string(),
    data: z.object({
        months: z.string(),
        minValue: z.number(),
        maxValue: z.number(),
        increasePercent: z.number(),
    }),
});

export type UpdateGoalRequestParams = z.infer<typeof updateGoalSchema>;