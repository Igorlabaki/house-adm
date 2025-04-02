import { z } from "zod";

export const deleteWorkerRequestParamSchema = z.object({
    personId: z.string(),
})

export type DeleteWorkerRequestParamSchema = z.infer<typeof deleteWorkerRequestParamSchema>;

