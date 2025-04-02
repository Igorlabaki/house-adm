import { z } from "zod";

export const getbyidGuestRequestParamSchema = z.object({
    personId: z.string(),
})

export type GetByIdGuestRequestParamSchema = z.infer<typeof getbyidGuestRequestParamSchema>;

