import { z } from "zod";

export const listGuestRequestQuerySchema = z.object({
    proposalId: z.string(),
    name: z.string().optional(),
    type: z.enum(["GUEST"]),
})

export type ListGuestRequestQuerySchema = z.infer<typeof listGuestRequestQuerySchema>;

