import { z } from "zod";

export const listPersonRequestQuerySchema = z.object({
    proposalId: z.string(),
    name: z.string().optional(),
})

export type ListPersonRequestQuerySchema = z.infer<typeof listPersonRequestQuerySchema>;

