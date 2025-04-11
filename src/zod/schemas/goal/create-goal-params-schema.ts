import { z } from "zod";

export const createGoalSchema = z.object({
    venueId: z.string(),
    minValue: z.string(),
    months: z.array(z.string()).optional().default([]),
    increasePercent: z.string(),
    maxValue: z.string().optional(),
});

export type CreateGoalRequestParams = z.infer<typeof createGoalSchema>;