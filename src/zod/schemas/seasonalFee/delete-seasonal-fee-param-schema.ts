import { z } from "zod";

export const deleteSeasonalFeeRequestParamSchema = z.object({
    seasonalfeeId: z.string(),
})

export type DeleteSeasonalFeeRequestParamSchema = z.infer<typeof deleteSeasonalFeeRequestParamSchema>;

