import { z } from "zod";

export const formSeasonalFeeSchema = z.object({
    fee: z.string(),
    title: z.string(),
    venueId: z.string(),
    endDay: z.string().optional(),
    startDay: z.string().optional(),
    type: z.enum(["SURCHARGE", "DISCOUNT"]),
    periodType: z.enum(["WEEKDAYS", "SEASON"]),
    affectedDays: z.array(z.string()).optional().default([]),
});

export type FormSeasonalFeeRequestParams = z.infer<typeof formSeasonalFeeSchema>;