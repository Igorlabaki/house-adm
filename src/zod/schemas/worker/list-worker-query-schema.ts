import { z } from "zod";

export const listWorkerRequestQuerySchema = z.object({
    proposalId: z.string(),
    name: z.string().optional(),
    type: z.enum(["WORKER"]),
})

export type ListWorkerRequestQuerySchema = z.infer<typeof listWorkerRequestQuerySchema>;

