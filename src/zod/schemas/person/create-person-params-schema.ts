import { z } from "zod";

export const createPersonSchema = z.object({
    name: z.string(),
    type: z.string(),
    proposalId: z.string(),
    rg: z.string().optional(),
    email: z.string().optional(),
    userId: z.string().optional(),
    username: z.string().optional(),
});

export type CreatePersonRequestParams = z.infer<typeof createPersonSchema>;