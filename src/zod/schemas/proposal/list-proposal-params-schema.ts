import { z } from "zod";

export const listProposalRequestQuerySchema = z.object({
    venueId:z.string(),
    name: z.string().optional(),
    email: z.string().optional(),
})

export type ListProposalRequestQuerySchema = z.infer<typeof listProposalRequestQuerySchema>;

