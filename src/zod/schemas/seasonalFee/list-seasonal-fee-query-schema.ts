import { z } from "zod";

export const listSeasonalFeeRequestQuerySchema = z.object({
    venueId: z.string(),
    title: z.string().optional(),
})

export type ListSeasonalFeeRequestQuerySchema = z.infer<typeof listSeasonalFeeRequestQuerySchema>;

