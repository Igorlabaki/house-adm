import { z } from "zod";

export const updateWorkerSchema = z.object({
    personId: z.string(),
    data: z.object({
        rg: z.string().optional(),
        name: z.string().optional(),
        email: z.string().optional(),
        attendance: z.boolean().optional(),
    }),
});

export type UpdateWorkerRequestParams = z.infer<typeof updateWorkerSchema>;