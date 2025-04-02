import { z } from "zod";

export const deleteGuestRequestParamSchema = z.object({
    personId: z.string(),
})

export type DeleteGuestRequestParamSchema = z.infer<typeof deleteGuestRequestParamSchema>;

