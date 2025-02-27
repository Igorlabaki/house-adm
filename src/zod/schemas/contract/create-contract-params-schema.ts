import { z } from "zod";

export const createContractSchema = z.object({
    title: z.string(),
    name: z.string(),
    organizationId: z.string(),
    clauses: z.array(z.object({
        text: z.string(),
        title: z.string(),
        position: z.number()
    })),
});

export type CreateContractRequestParams = z.infer<typeof createContractSchema>;